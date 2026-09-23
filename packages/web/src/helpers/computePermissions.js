/**
 * Convert the permission-catalog checkbox form shape into API permission rows.
 *
 * Form shape:
 *   permissions[subject][action] = { isCreator?: boolean, all?: boolean }
 *
 * API shape:
 *   [{ action, subject, conditions: [] | ['isCreator'] }, ...]
 */
export default function computePermissions(permissionsFieldValue = {}) {
  const result = [];

  Object.entries(permissionsFieldValue).forEach(([subject, actions]) => {
    if (!actions || typeof actions !== 'object') {
      return;
    }

    Object.entries(actions).forEach(([action, flags]) => {
      if (!flags) {
        return;
      }

      if (flags.all) {
        result.push({
          action,
          subject,
          conditions: [],
        });
      }

      if (flags.isCreator) {
        result.push({
          action,
          subject,
          conditions: ['isCreator'],
        });
      }
    });
  });

  return result;
}

/**
 * Convert API permission rows into the checkbox form shape.
 */
export function permissionsToFormValues(permissions = []) {
  const values = {};

  permissions.forEach((permission) => {
    const { subject, action, conditions = [] } = permission;

    if (!values[subject]) {
      values[subject] = {};
    }

    if (!values[subject][action]) {
      values[subject][action] = { isCreator: false, all: false };
    }

    if (conditions.includes('isCreator')) {
      values[subject][action].isCreator = true;
    } else {
      values[subject][action].all = true;
    }
  });

  return values;
}
