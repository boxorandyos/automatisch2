import * as React from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';

import ControlledCheckbox from 'components/ControlledCheckbox';

export default function OwnEntitiesPermission({
  action,
  subject,
  disabled,
  name,
}) {
  const { getValues, resetField } = useFormContext();
  const fieldName = `${name}.${subject.key}.${action.key}.ownEntities`;
  const allEntitiesFieldName = `${name}.${subject.key}.${action.key}.allEntities`;
  const currentValue = getValues(fieldName);

  React.useEffect(() => {
    if (currentValue === false) {
      resetField(allEntitiesFieldName, { defaultValue: false });
    }
  }, [allEntitiesFieldName, currentValue, resetField]);

  return (
    <ControlledCheckbox
      name={fieldName}
      disabled={disabled}
      dataTest={`isCreator-${action.key.toLowerCase()}-checkbox`}
    />
  );
}

OwnEntitiesPermission.propTypes = {
  action: PropTypes.shape({
    key: PropTypes.string.isRequired,
    subjects: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  subject: PropTypes.shape({
    key: PropTypes.string.isRequired,
  }).isRequired,
  disabled: PropTypes.bool,
  name: PropTypes.string.isRequired,
};
