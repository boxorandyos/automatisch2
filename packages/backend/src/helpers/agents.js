import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatOpenAI } from '@langchain/openai';
import { tool } from '@langchain/core/tools';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

import Config from '@/models/config.js';
import AgentTool from '@/models/agent-tool.js';
import App from '@/models/app.js';
import Connection from '@/models/connection.js';
import globalVariable from '@/engine/global-variable.js';
import { schemaFromActionArguments } from '@/helpers/mcp.js';

const providers = {
  anthropic: ChatAnthropic,
  openai: ChatOpenAI,
};

const defaultModels = {
  anthropic: 'claude-3-5-sonnet-20241022',
  openai: 'gpt-4o',
};

export async function getAgentTools(agentId) {
  return await AgentTool.query().where({ agent_id: agentId });
}

export async function generateTools(agentTools) {
  const tools = [];

  for (const agentTool of agentTools) {
    if (agentTool.type !== 'app') {
      continue;
    }

    const { appKey, actions } = agentTool;
    const app = await App.findOneByKey(appKey);
    const appActions = app.actions || [];

    for (const actionKey of actions || []) {
      const appAction = appActions.find(({ key }) => key === actionKey);

      if (!appAction) continue;

      const toolName = `${appKey}_${appAction.key}`;
      const chooseTriggerStep = (appAction.substeps || []).find(
        ({ key }) => key === 'chooseTrigger'
      );
      const toolSchema = schemaFromActionArguments(
        chooseTriggerStep?.arguments || appAction.arguments || []
      );

      const toolInstance = tool(
        async (input) => {
          const $ = await globalVariable({
            app,
            connection: await Connection.query().findById(
              agentTool.connectionId
            ),
            testRun: false,
            step: {
              parameters: input,
            },
          });

          try {
            await appAction.run($);
            return JSON.stringify($.actionOutput.data?.raw ?? {});
          } catch (error) {
            return error.message || '';
          }
        },
        {
          name: toolName,
          description: appAction.description || toolName,
          schema: toolSchema,
        }
      );

      tools.push(toolInstance);
    }
  }

  return tools;
}

export default async function runAgent(agent, { prompt, messages }) {
  if (!prompt && !messages) {
    throw new Error('Either prompt or messages must be provided');
  }

  const { provider, key } = await Config.getDefaultAiProviderWithKey();

  if (!provider || !key) {
    throw new Error('Default AI provider is not configured');
  }

  const ProviderClass = providers[provider];

  if (!ProviderClass) {
    throw new Error(`Unsupported AI provider: ${provider}`);
  }

  const agentTools = await getAgentTools(agent.id);
  const tools = await generateTools(agentTools);

  const llm = new ProviderClass({
    model: defaultModels[provider],
    apiKey: key,
    temperature: 0,
  });

  let promptTemplate;
  let invokeParams;
  let userPrompt;

  if (messages && messages.length > 0) {
    const chatHistory = [];

    for (const message of messages.slice(0, -1)) {
      if (message.role === 'user') {
        chatHistory.push(new HumanMessage(message.content));
      } else if (message.role === 'assistant') {
        chatHistory.push(new AIMessage(message.content));
      }
    }

    const latestMessage = messages[messages.length - 1];

    if (latestMessage.role !== 'user') {
      throw new Error('Last message must be from user');
    }

    userPrompt = latestMessage.content;

    promptTemplate = ChatPromptTemplate.fromMessages([
      ['system', '{system_instructions}'],
      new MessagesPlaceholder('chat_history'),
      ['human', '{input}'],
      new MessagesPlaceholder('agent_scratchpad'),
    ]);

    invokeParams = {
      input: userPrompt,
      system_instructions: agent.instructions || 'You are a helpful assistant.',
      chat_history: chatHistory,
    };
  } else {
    userPrompt = prompt;

    promptTemplate = ChatPromptTemplate.fromMessages([
      ['system', '{system_instructions}'],
      ['human', '{input}'],
      ['placeholder', '{agent_scratchpad}'],
    ]);

    invokeParams = {
      input: userPrompt,
      system_instructions: agent.instructions || 'You are a helpful assistant.',
    };
  }

  const toolCallingAgent = await createToolCallingAgent({
    llm,
    tools,
    prompt: promptTemplate,
  });

  const agentExecutor = new AgentExecutor({
    agent: toolCallingAgent,
    tools,
    verbose: false,
  });

  try {
    const result = await agentExecutor.invoke(invokeParams);
    const outputText = result.output?.[0]?.text || result.output;

    await agent.$relatedQuery('agentExecutions').insert({
      agentId: agent.id,
      prompt: userPrompt,
      output: outputText,
      status: 'completed',
      finishedAt: new Date().toISOString(),
    });

    return {
      output: result.output,
      intermediateSteps: result.intermediateSteps || [],
    };
  } catch (error) {
    await agent.$relatedQuery('agentExecutions').insert({
      agentId: agent.id,
      prompt: userPrompt,
      output: error.message,
      status: 'failed',
      finishedAt: new Date().toISOString(),
    });

    throw new Error(`Agent execution failed: ${error.message}`);
  }
}
