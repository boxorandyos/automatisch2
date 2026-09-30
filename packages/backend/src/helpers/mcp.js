import crypto from 'node:crypto';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import App from '@/models/app.js';
import Connection from '@/models/connection.js';
import Flow from '@/models/flow.js';
import globalVariable from '@/engine/global-variable.js';
import Engine from '@/engine/index.js';
import HttpError from '@/errors/http.js';

/**
 * Build a Zod object schema from Automatisch action argument definitions.
 */
export function schemaFromActionArguments(actionArguments = []) {
  const shape = {};

  for (const argument of actionArguments) {
    if (!argument?.key) continue;

    const {
      key,
      label,
      type,
      description,
      fields,
      required,
      options,
      value,
    } = argument;

    let rule = z.string();

    if (type === 'dynamic' && Array.isArray(fields)) {
      const innerShape = {};

      for (const field of fields) {
        if (!field?.key) continue;

        let inner = z.string();
        if (field.description || field.label) {
          inner = inner.describe(
            field.description || `Parameter: ${field.label}`,
          );
        }
        innerShape[field.key] = inner;
      }

      rule = z.array(z.object(innerShape));
      rule = required ? rule.min(1) : rule.min(0);
    } else if (type === 'dropdown' && options?.length) {
      const values = options.map((option) => option.value);
      const allNumbers = values.every((entry) => typeof entry === 'number');

      if (values.length === 1) {
        rule = z.literal(values[0]);
      } else if (allNumbers) {
        rule = z.union(values.map((entry) => z.literal(entry)));
      } else {
        rule = z.enum(values.map(String));
      }

      if (!required) {
        rule = rule.nullable().optional();
      }
    } else if (type === 'string') {
      if (typeof value === 'number') {
        rule = z.number();
      } else {
        rule = z.string();
      }

      if (!required) {
        rule = rule.nullable().optional();
      }
    } else if (!required) {
      rule = rule.nullable().optional();
    }

    if (description || label) {
      rule = rule.describe(description || `Parameter: ${label}`);
    }

    shape[key] = rule;
  }

  return Object.keys(shape).length
    ? z.object(shape)
    : z.object({}).passthrough();
}

export function formatMcpToolResponse(type, data = {}) {
  const prefixes = {
    success: 'OK',
    error: 'Error',
    info: 'Info',
  };

  let text = `${prefixes[type] || 'Info'}: ${data.message || ''}`.trim();

  if (type === 'success' && data.data !== undefined) {
    text += `\n\nResult:\n\`\`\`json\n${JSON.stringify(data.data, null, 2)}\n\`\`\``;
  }

  if (type === 'error' && data.error) {
    text += `\n${JSON.stringify(data.error, null, 2)}`;
  }

  return {
    content: [
      {
        type: 'text',
        text,
      },
    ],
    ...(type === 'error' ? { isError: true } : {}),
  };
}

export async function describeMcpTools(mcpServer) {
  const mcpTools = await mcpServer
    .$relatedQuery('mcpTools')
    .orderBy('created_at', 'asc');

  const tools = [];

  for (const tool of mcpTools) {
    if (tool.type === 'app') {
      const app = await App.findOneByKey(tool.appKey);
      const appAction = (app.actions || []).find(
        ({ key }) => key === tool.action,
      );

      if (!appAction) continue;

      const chooseTrigger = (appAction.substeps || []).find(
        ({ key }) => key === 'chooseTrigger',
      );
      const zodSchema = schemaFromActionArguments(
        chooseTrigger?.arguments || appAction.arguments || [],
      );

      tools.push({
        mcpTool: tool,
        name: `${tool.appKey}_${appAction.key}`,
        description: appAction.description || `${tool.appKey} ${appAction.key}`,
        zodSchema,
        inputSchema: zodToJsonSchema(zodSchema),
        kind: 'app',
      });
    } else if (tool.type === 'flow' && tool.flowId) {
      const flow = await Flow.query().findById(tool.flowId);

      if (!flow?.active) continue;

      const triggerStep = await flow.getTriggerStep();

      if (triggerStep?.appKey !== 'mcp' || triggerStep?.key !== 'mcpTool') {
        continue;
      }

      const {
        toolName,
        toolDescription,
        inputSchema: rawSchema,
      } = triggerStep.parameters || {};

      let parsedSchema = { type: 'object', properties: {} };

      if (rawSchema) {
        try {
          parsedSchema =
            typeof rawSchema === 'string' ? JSON.parse(rawSchema) : rawSchema;
        } catch {
          parsedSchema = { type: 'object', properties: {} };
        }
      }

      const name = toolName || tool.action || `flow_${flow.id}`;

      tools.push({
        mcpTool: tool,
        flow,
        name,
        description: toolDescription || flow.name || name,
        zodSchema: z.object({}).passthrough(),
        inputSchema: parsedSchema,
        kind: 'flow',
      });
    }
  }

  return tools;
}

export async function executeAppMcpTool(mcpTool, parameters = {}) {
  const app = await App.findOneByKey(mcpTool.appKey);
  const appAction = (app.actions || []).find(
    ({ key }) => key === mcpTool.action,
  );

  if (!appAction) {
    throw new Error(
      `Action not found: ${mcpTool.action} for app ${mcpTool.appKey}`,
    );
  }

  try {
    const $ = await globalVariable({
      app,
      connection: await Connection.query().findById(mcpTool.connectionId),
      testRun: false,
      step: {
        parameters,
      },
    });

    await appAction.run($);
    const actionOutput = $.actionOutput?.data;

    await mcpTool.$relatedQuery('mcpToolExecutions').insert({
      dataIn: JSON.stringify(parameters),
      dataOut: JSON.stringify(actionOutput?.raw ?? {}),
      status: 'success',
    });

    return formatMcpToolResponse('success', {
      message: `Successfully invoked action \`${mcpTool.action}\` on app \`${mcpTool.appKey}\``,
      data: actionOutput?.raw,
    });
  } catch (error) {
    let details;

    if (error instanceof HttpError) {
      details = error.details;
    } else {
      try {
        details = JSON.parse(error.message);
      } catch {
        details = { error: error.message };
      }
    }

    await mcpTool.$relatedQuery('mcpToolExecutions').insert({
      dataIn: JSON.stringify(parameters),
      errorDetails: details,
      status: 'failure',
    });

    return formatMcpToolResponse('error', {
      message: `Failed to invoke action \`${mcpTool.action}\` on \`${mcpTool.appKey}\``,
      error: details,
    });
  }
}

export async function executeFlowMcpTool(mcpTool, flow, parameters = {}) {
  const engineResult = await Engine.run({
    flowId: flow.id,
    mcpToolId: mcpTool.id,
    triggeredByMcp: true,
    triggeredByRequest: true,
    initialData: [
      {
        raw: parameters,
        meta: {
          internalId: crypto.randomUUID(),
        },
      },
    ],
  });

  if (engineResult?.mcpError) {
    return formatMcpToolResponse('error', { message: engineResult.mcpError });
  }

  if (engineResult?.mcpSuccess) {
    return formatMcpToolResponse('success', {
      message: engineResult.mcpSuccess,
      data: engineResult.mcpData,
    });
  }

  return formatMcpToolResponse('success', {
    message: `Successfully executed flow \`${flow.name}\``,
    data: engineResult?.body ?? engineResult ?? {},
  });
}

export async function executeDescribedMcpTool(describedTool, parameters = {}) {
  if (describedTool.kind === 'app') {
    return executeAppMcpTool(describedTool.mcpTool, parameters);
  }

  if (describedTool.kind === 'flow') {
    return executeFlowMcpTool(
      describedTool.mcpTool,
      describedTool.flow,
      parameters,
    );
  }

  return formatMcpToolResponse('error', {
    message: `Unsupported MCP tool type`,
  });
}
