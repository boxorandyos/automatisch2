/**
 * Convert role permission checkbox form values into API permission rows.
 *
 * Form shape (per subject/action):
 *   { ownEntities?: boolean, allEntities?: boolean }
 *
 * API shape:
 *   [{ action, subject, conditions: [] | ['isCreator'] }, ...]
 */
export function getPermissions(computedPermissions) {
  if (!computedPermissions) return [];

  return Object.entries(computedPermissions).reduce(
    (permissions, [subject, actionsWithConditions]) => {
      for (const action in actionsWithConditions) {
        const { ownEntities, allEntities } = actionsWithConditions[action];

        if (ownEntities && !allEntities) {
          permissions.push({
            action,
            subject,
            conditions: ['isCreator'],
          });
        } else if (ownEntities && allEntities) {
          permissions.push({
            action,
            subject,
            conditions: [],
          });
        }
      }

      return permissions;
    },
    [],
  );
}

export function getRoleWithComputedPermissions(role) {
  if (!role) return {};

  const computedPermissions = role.permissions?.reduce(
    (computed, permission) => ({
      ...computed,
      [permission.subject]: {
        ...(computed[permission.subject] || {}),
        [permission.action]: {
          allEntities: permission.conditions.includes('isCreator') === false,
          ownEntities: true,
        },
      },
    }),
    {},
  );

  return {
    ...role,
    computedPermissions,
  };
}

export function getComputedPermissionsDefaultValues(data) {
  if (!data) return {};

  const result = {};

  data.subjects.forEach((subject) => {
    const subjectKey = subject.key;
    result[subjectKey] = {};

    data.actions.forEach((action) => {
      if (action.subjects.includes(subjectKey)) {
        result[subjectKey][action.key] = {
          ownEntities: false,
          allEntities: false,
        };
      }
    });
  });

  return result;
}

// Backwards-compatible aliases used by older call sites.
export default function computePermissions(permissionsFieldValue) {
  return getPermissions(permissionsFieldValue);
}

export function permissionsToFormValues(permissions = []) {
  return getRoleWithComputedPermissions({ permissions }).computedPermissions || {};
}
