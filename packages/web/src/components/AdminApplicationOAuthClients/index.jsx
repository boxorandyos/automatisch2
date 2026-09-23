import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';

import * as URLS from 'config/urls';
import useAdminOAuthClients from 'hooks/useAdminOAuthClients';
import useFormatMessage from 'hooks/useFormatMessage';

export default function AdminApplicationOAuthClients({ appKey }) {
  const formatMessage = useFormatMessage();
  const { data, isLoading } = useAdminOAuthClients(appKey);
  const clients = data?.data || [];

  if (isLoading) {
    return <CircularProgress sx={{ display: 'block', m: '20px auto' }} />;
  }

  return (
    <Box>
      <Button
        variant="contained"
        component={Link}
        to={URLS.ADMIN_APP_AUTH_CLIENTS_CREATE(appKey)}
        sx={{ mb: 2 }}
      >
        {formatMessage('createOAuthClient.button')}
      </Button>

      {!clients.length && (
        <Typography color="text.secondary">
          {formatMessage('adminAppsOAuthClients.noOauthClients')}
        </Typography>
      )}

      <List>
        {clients.map((client) => (
          <ListItemButton
            key={client.id}
            component={Link}
            to={URLS.ADMIN_APP_AUTH_CLIENT(appKey, client.id)}
          >
            <ListItemText
              primary={client.name}
              secondary={
                <Chip
                  size="small"
                  label={
                    client.active
                      ? formatMessage('adminAppsOAuthClients.statusActive')
                      : formatMessage('adminAppsOAuthClients.statusInactive')
                  }
                  color={client.active ? 'success' : 'default'}
                />
              }
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}

AdminApplicationOAuthClients.propTypes = {
  appKey: PropTypes.string.isRequired,
};
