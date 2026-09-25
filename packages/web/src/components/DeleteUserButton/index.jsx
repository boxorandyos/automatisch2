import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

import ConfirmationDialog from 'components/ConfirmationDialog';
import { getGeneralErrorMessage } from 'helpers/errors';
import useAdminUserDelete from 'hooks/useAdminUserDelete';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useFormatMessage from 'hooks/useFormatMessage';

export default function DeleteUserButton({ userId }) {
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    mutateAsync: removeUser,
    error,
    reset,
  } = useAdminUserDelete(userId);

  const errorText = getGeneralErrorMessage({
    error,
    fallbackMessage: formatMessage('deleteUserButton.deleteError'),
  });

  const closeDialog = () => {
    setDialogOpen(false);
    reset();
  };

  const confirmDeletion = useCallback(async () => {
    try {
      await removeUser();
      await queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      setDialogOpen(false);
      enqueueSnackbar(formatMessage('deleteUserButton.successfullyDeleted'), {
        variant: 'success',
        SnackbarProps: {
          'data-test': 'snackbar-delete-user-success',
        },
      });
    } catch (deleteError) {
      console.error(deleteError);
    }
  }, [enqueueSnackbar, formatMessage, queryClient, removeUser]);

  return (
    <>
      <IconButton
        data-test="delete-button"
        onClick={() => setDialogOpen(true)}
        size="small"
      >
        <DeleteIcon />
      </IconButton>

      <ConfirmationDialog
        cancelButtonChildren={formatMessage('deleteUserButton.cancel')}
        confirmButtonChildren={formatMessage('deleteUserButton.confirm')}
        data-test="delete-user-modal"
        description={formatMessage('deleteUserButton.description')}
        errorMessage={errorText}
        onClose={closeDialog}
        onConfirm={confirmDeletion}
        open={dialogOpen}
        title={formatMessage('deleteUserButton.title')}
      />
    </>
  );
}

DeleteUserButton.propTypes = {
  userId: PropTypes.string.isRequired,
};
