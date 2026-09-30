import * as React from 'react';
import PropTypes from 'prop-types';
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';

import useFormatMessage from 'hooks/useFormatMessage';
import useOAuthClients from 'hooks/useOAuthClients';

export default function OAuthClientsDialog({ appKey, onClose, onClientClick }) {
  const formatMessage = useFormatMessage();
  const { data, isLoading } = useOAuthClients(appKey);
  const clients = (data?.data || []).filter((client) => client.active);

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{formatMessage('appOAuthClientsDialog.title')}</DialogTitle>
      <DialogContent>
        {isLoading && (
          <CircularProgress sx={{ display: 'block', m: '20px auto' }} />
        )}
        <List>
          {clients.map((client) => (
            <ListItemButton
              key={client.id}
              onClick={() => onClientClick?.(client)}
            >
              <ListItemText primary={client.name} />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}

OAuthClientsDialog.propTypes = {
  appKey: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onClientClick: PropTypes.func,
};
