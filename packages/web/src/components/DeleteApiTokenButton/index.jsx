import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

import ConfirmationDialog from 'components/ConfirmationDialog';
import { getGeneralErrorMessage } from 'helpers/errors';
import useAdminDeleteApiToken from 'hooks/useAdminDeleteApiToken';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useFormatMessage from 'hooks/useFormatMessage';

export default function DeleteApiTokenButton({ apiTokenId }) {
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    mutateAsync: removeToken,
    error,
    reset,
  } = useAdminDeleteApiToken(apiTokenId);

  const errorText = getGeneralErrorMessage({
    error,
    fallbackMessage: formatMessage('deleteApiTokenButton.deleteError'),
  });

  const closeDialog = () => {
    setDialogOpen(false);
    reset();
  };

  const confirmDeletion = useCallback(async () => {
    try {
      await removeToken();
      setDialogOpen(false);
      enqueueSnackbar(formatMessage('deleteApiTokenButton.successfullyDeleted'), {
        variant: 'success',
        SnackbarProps: {
          'data-test': 'snackbar-delete-api-token-success',
        },
      });
    } catch (deleteError) {
      console.error(deleteError);
    }
  }, [enqueueSnackbar, formatMessage, removeToken]);

  return (
    <>
      <IconButton
        onClick={() => setDialogOpen(true)}
        size="small"
        data-test="delete-button"
      >
        <DeleteIcon />
      </IconButton>
      <ConfirmationDialog
        open={dialogOpen}
        onClose={closeDialog}
        onConfirm={confirmDeletion}
        title={formatMessage('deleteApiTokenButton.title')}
        description={formatMessage('deleteApiTokenButton.description')}
        cancelButtonChildren={formatMessage('deleteApiTokenButton.cancel')}
        confirmButtonChildren={formatMessage('deleteApiTokenButton.confirm')}
        errorMessage={errorText}
        data-test="delete-api-token-modal"
      />
    </>
  );
}

DeleteApiTokenButton.propTypes = {
  apiTokenId: PropTypes.string.isRequired,
};
