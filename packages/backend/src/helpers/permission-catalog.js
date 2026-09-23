/**
 * Canonical permission subjects and actions for Community Edition.
 * Consumed by Permission model validation.
 */

const SUBJECTS = Object.freeze([
  { key: 'Connection', label: 'Connection' },
  { key: 'Flow', label: 'Flow' },
  { key: 'Execution', label: 'Execution' },
]);

const CONDITIONS = Object.freeze([
  { key: 'isCreator', label: 'Is creator' },
]);

const ACTIONS = Object.freeze([
  {
    key: 'read',
    label: 'Read',
    subjects: ['Connection', 'Execution', 'Flow'],
  },
  {
    key: 'manage',
    label: 'Manage',
    subjects: ['Connection', 'Flow'],
  },
]);

const permissionCatalog = Object.freeze({
  subjects: SUBJECTS,
  conditions: CONDITIONS,
  actions: ACTIONS,
});

export default permissionCatalog;
