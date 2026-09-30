import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import * as React from 'react';
import { Link } from 'react-router-dom';

import * as URLS from 'config/urls';
import useDeleteForm from 'hooks/useDeleteForm';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useFormatMessage from 'hooks/useFormatMessage';

export default function FormContextMenu({ formId, onClose, anchorEl }) {
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
  const { mutateAsync: deleteForm } = useDeleteForm(formId);

  const onDelete = React.useCallback(async () => {
    await deleteForm();
    enqueueSnackbar(formatMessage('formContextMenu.successfullyDeleted'), {
      variant: 'success',
    });
    onClose();
  }, [deleteForm, enqueueSnackbar, formatMessage, onClose]);

  return (
    <Menu open={true} onClose={onClose} anchorEl={anchorEl}>
      <MenuItem component={Link} to={URLS.EDIT_FORM(formId)} onClick={onClose}>
        Edit
      </MenuItem>
      <MenuItem onClick={onDelete}>Delete</MenuItem>
    </Menu>
  );
}

FormContextMenu.propTypes = {
  formId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  anchorEl: PropTypes.any,
};
