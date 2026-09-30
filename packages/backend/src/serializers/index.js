import actionSerializer from '@/serializers/action.js';
import adminApiTokenFullSerializer from '@/serializers/admin/api-token-full.js';
import adminApiTokenSerializer from '@/serializers/admin/api-token.js';
import adminOAuthClientSerializer from '@/serializers/admin/oauth-client.js';
import adminSamlAuthProviderSerializer from '@/serializers/admin-saml-auth-provider.js';
import adminTemplateSerializer from '@/serializers/admin/template.js';
import adminUserSerializer from '@/serializers/admin/user.js';
import agentExecutionSerializer from '@/serializers/agent-execution.js';
import agentSerializer from '@/serializers/agent.js';
import agentToolSerializer from '@/serializers/agent-tool.js';
import apiTokenFullSerializer from '@/serializers/api-token-full.js';
import apiTokenSerializer from '@/serializers/api-token.js';
import appConfigSerializer from '@/serializers/app-config.js';
import appSerializer from '@/serializers/app.js';
import authSerializer from '@/serializers/auth.js';
import configSerializer from '@/serializers/config.js';
import connectionSerializer from '@/serializers/connection.js';
import executionStepSerializer from '@/serializers/execution-step.js';
import executionSerializer from '@/serializers/execution.js';
import flowSerializer from '@/serializers/flow.js';
import folderSerializer from '@/serializers/folder.js';
import formSerializer from '@/serializers/form.js';
import mcpServerSerializer from '@/serializers/mcp-server.js';
import mcpToolExecutionSerializer from '@/serializers/mcp-tool-execution.js';
import mcpToolSerializer from '@/serializers/mcp-tool.js';
import oauthClientSerializer from '@/serializers/oauth-client.js';
import permissionSerializer from '@/serializers/permission.js';
import publicFormSerializer from '@/serializers/public-form.js';
import publicTemplateSerializer from '@/serializers/public-template.js';
import publicUserInvitationSerializer from '@/serializers/public-user-invitation.js';
import roleMappingSerializer from '@/serializers/role-mapping.js';
import roleSerializer from '@/serializers/role.js';
import samlAuthProviderSerializer from '@/serializers/saml-auth-provider.js';
import stepSerializer from '@/serializers/step.js';
import subscriptionSerializer from '@/serializers/subscription.js';
import templateSerializer from '@/serializers/template.js';
import triggerSerializer from '@/serializers/trigger.js';
import userAppSerializer from '@/serializers/user-app.js';
import userSerializer from '@/serializers/user.js';

const serializers = {
  Action: actionSerializer,
  AdminApiToken: adminApiTokenSerializer,
  AdminApiTokenFull: adminApiTokenFullSerializer,
  AdminOAuthClient: adminOAuthClientSerializer,
  AdminSamlAuthProvider: adminSamlAuthProviderSerializer,
  AdminTemplate: adminTemplateSerializer,
  AdminUser: adminUserSerializer,
  Agent: agentSerializer,
  AgentExecution: agentExecutionSerializer,
  AgentTool: agentToolSerializer,
  ApiToken: apiTokenSerializer,
  ApiTokenFull: apiTokenFullSerializer,
  App: appSerializer,
  AppConfig: appConfigSerializer,
  Auth: authSerializer,
  Config: configSerializer,
  Connection: connectionSerializer,
  Execution: executionSerializer,
  ExecutionStep: executionStepSerializer,
  Flow: flowSerializer,
  Folder: folderSerializer,
  Form: formSerializer,
  McpServer: mcpServerSerializer,
  McpTool: mcpToolSerializer,
  McpToolExecution: mcpToolExecutionSerializer,
  OAuthClient: oauthClientSerializer,
  Permission: permissionSerializer,
  PublicForm: publicFormSerializer,
  PublicTemplate: publicTemplateSerializer,
  PublicUserInvitation: publicUserInvitationSerializer,
  Role: roleSerializer,
  RoleMapping: roleMappingSerializer,
  SamlAuthProvider: samlAuthProviderSerializer,
  Step: stepSerializer,
  Subscription: subscriptionSerializer,
  Template: templateSerializer,
  Trigger: triggerSerializer,
  User: userSerializer,
  UserApp: userAppSerializer,
};

export default serializers;
