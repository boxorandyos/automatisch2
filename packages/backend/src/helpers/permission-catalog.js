/**
 * Permission subjects and actions available in the product.
 * Used by Permission model validation and the admin roles UI.
 */

const SUBJECTS = Object.freeze([
  { key: 'Connection', label: 'Connection' },
  { key: 'Flow', label: 'Flow' },
  { key: 'Execution', label: 'Execution' },
  { key: 'McpServer', label: 'MCP Server' },
  { key: 'Agent', label: 'Agent' },
  { key: 'User', label: 'User' },
  { key: 'Role', label: 'Role' },
  { key: 'SamlAuthProvider', label: 'SAML auth provider' },
  { key: 'App', label: 'App' },
  { key: 'Config', label: 'Config' },
  { key: 'ApiToken', label: 'API token' },
  { key: 'Template', label: 'Template' },
]);

const CONDITIONS = Object.freeze([
  { key: 'isCreator', label: 'Is creator' },
]);

const ACTIONS = Object.freeze([
  {
    key: 'read',
    label: 'Read',
    subjects: ['Connection', 'Execution', 'Flow', 'McpServer', 'Agent'],
  },
  {
    key: 'manage',
    label: 'Manage',
    subjects: [
      'Connection',
      'Flow',
      'McpServer',
      'Agent',
      'User',
      'Role',
      'SamlAuthProvider',
      'App',
      'Config',
      'ApiToken',
      'Template',
    ],
  },
]);

const permissionCatalog = Object.freeze({
  subjects: SUBJECTS,
  conditions: CONDITIONS,
  actions: ACTIONS,
});

export default permissionCatalog;
