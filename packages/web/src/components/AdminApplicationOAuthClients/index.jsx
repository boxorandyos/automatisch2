import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';

import NoResultFound from 'components/NoResultFound';
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

  if (!clients.length) {
    return (
      <NoResultFound
        to={URLS.ADMIN_APP_AUTH_CLIENTS_CREATE(appKey)}
        text={formatMessage('adminAppsOAuthClients.noOauthClients')}
      />
    );
  }

  const sortedClients = clients.slice().sort((a, b) => {
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return 0;
  });

  return (
    <div>
      {sortedClients.map((client) => (
        <Card sx={{ mb: 1 }} key={client.id} data-test="auth-client">
          <CardActionArea
            component={Link}
            to={URLS.ADMIN_APP_AUTH_CLIENT(appKey, client.id)}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6" noWrap>
                  {client.name}
                </Typography>
                <Chip
                  size="small"
                  color={client.active ? 'success' : 'info'}
                  variant={client.active ? 'filled' : 'outlined'}
                  label={formatMessage(
                    client.active
                      ? 'adminAppsOAuthClients.statusActive'
                      : 'adminAppsOAuthClients.statusInactive',
                  )}
                />
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}

      <Stack justifyContent="flex-end" direction="row">
        <Link to={URLS.ADMIN_APP_AUTH_CLIENTS_CREATE(appKey)}>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            component="div"
            data-test="create-auth-client-button"
          >
            {formatMessage('createOAuthClient.button')}
          </Button>
        </Link>
      </Stack>
    </div>
  );
}

AdminApplicationOAuthClients.propTypes = {
  appKey: PropTypes.string.isRequired,
};
