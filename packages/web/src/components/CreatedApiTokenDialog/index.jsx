import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';

import useFormatMessage from 'hooks/useFormatMessage';

export default function CreatedApiTokenDialog({ open, onClose, token }) {
  const formatMessage = useFormatMessage();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{formatMessage('createdApiTokenDialog.title')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {formatMessage('createdApiTokenDialog.description')}
        </Typography>
        <TextField
          label={formatMessage('createdApiTokenDialog.apiTokenFieldLabel')}
          value={token || ''}
          fullWidth
          InputProps={{ readOnly: true }}
        />
        <Alert severity="warning" sx={{ mt: 2 }}>
          {formatMessage('createdApiTokenDialog.warningForApiToken', {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {formatMessage('createdApiTokenDialog.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CreatedApiTokenDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  token: PropTypes.string,
};
