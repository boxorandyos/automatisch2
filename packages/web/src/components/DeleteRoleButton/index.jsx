import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

import ConfirmationDialog from 'components/ConfirmationDialog';
import { getFieldErrorMessage, getGeneralErrorMessage } from 'helpers/errors';
import useAdminDeleteRole from 'hooks/useAdminDeleteRole';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useFormatMessage from 'hooks/useFormatMessage';

export default function DeleteRoleButton({ roleId, disabled = false }) {
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    mutateAsync: removeRole,
    error,
    reset,
  } = useAdminDeleteRole(roleId);

  const roleErrorMessage = getFieldErrorMessage({
    fieldName: 'role',
    error,
  });

  const generalErrorMessage = getGeneralErrorMessage({
    error,
    fallbackMessage: formatMessage('deleteRoleButton.generalError'),
  });

  const closeDialog = () => {
    setDialogOpen(false);
    reset();
  };

  const confirmDeletion = useCallback(async () => {
    try {
      await removeRole();
      setDialogOpen(false);
      enqueueSnackbar(formatMessage('deleteRoleButton.successfullyDeleted'), {
        variant: 'success',
        SnackbarProps: {
          'data-test': 'snackbar-delete-role-success',
        },
      });
    } catch (deleteError) {
      console.error(deleteError);
    }
  }, [enqueueSnackbar, formatMessage, removeRole]);

  return (
    <>
      <IconButton
        data-test="role-delete"
        onClick={() => setDialogOpen(true)}
        size="small"
        disabled={disabled}
      >
        <DeleteIcon />
      </IconButton>

      <ConfirmationDialog
        cancelButtonChildren={formatMessage('deleteRoleButton.cancel')}
        confirmButtonChildren={formatMessage('deleteRoleButton.confirm')}
        data-test="delete-role-modal"
        description={formatMessage('deleteRoleButton.description')}
        errorMessage={roleErrorMessage || generalErrorMessage}
        onClose={closeDialog}
        onConfirm={confirmDeletion}
        open={dialogOpen}
        title={formatMessage('deleteRoleButton.title')}
      />
    </>
  );
}

DeleteRoleButton.propTypes = {
  roleId: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};
