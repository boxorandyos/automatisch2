import * as React from 'react';
import {
  Link,
  Navigate,
  Route,
  Routes,
  useMatch,
  useParams,
} from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import AdminApplicationOAuthClients from 'components/AdminApplicationOAuthClients';
import AdminApplicationSettings from 'components/AdminApplicationSettings';
import AppIcon from 'components/AppIcon';
import Container from 'components/Container';
import PageTitle from 'components/PageTitle';
import * as URLS from 'config/urls';
import useApp from 'hooks/useApp';
import useFormatMessage from 'hooks/useFormatMessage';
import AdminCreateOAuthClient from './AdminCreateOAuthClient';
import AdminUpdateOAuthClient from './AdminUpdateOAuthClient';

export default function AdminApplication() {
  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('md'));
  const formatMessage = useFormatMessage();
  const { appKey } = useParams();
  const { data, isLoading } = useApp(appKey);
  const app = data?.data || {};

  const settingsMatch = useMatch({
    path: URLS.ADMIN_APP_SETTINGS_PATTERN,
    end: false,
  });
  const authClientsMatch = useMatch({
    path: URLS.ADMIN_APP_AUTH_CLIENTS_PATTERN,
    end: false,
  });

  if (isLoading) {
    return null;
  }

  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Grid container sx={{ mb: 3 }} alignItems="center">
          <Grid item xs="auto" sx={{ mr: 3 }}>
            <AppIcon url={app.iconUrl} color={app.primaryColor} name={app.name} />
          </Grid>
          <Grid item xs>
            <PageTitle>{app.name}</PageTitle>
          </Grid>
        </Grid>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs
            variant={matchSmallScreens ? 'fullWidth' : undefined}
            value={
              settingsMatch?.pattern?.path ||
              authClientsMatch?.pattern?.path ||
              URLS.ADMIN_APP_SETTINGS_PATTERN
            }
          >
            <Tab
              label={formatMessage('adminApps.settings')}
              to={URLS.ADMIN_APP_SETTINGS(appKey)}
              value={URLS.ADMIN_APP_SETTINGS_PATTERN}
              component={Link}
            />
            {app.supportsOauthClients && (
              <Tab
                label={formatMessage('adminApps.oauthClients')}
                to={URLS.ADMIN_APP_AUTH_CLIENTS(appKey)}
                value={URLS.ADMIN_APP_AUTH_CLIENTS_PATTERN}
                component={Link}
                data-test="oauth-clients-tab"
              />
            )}
          </Tabs>
        </Box>

        <Routes>
          <Route
            path="settings"
            element={<AdminApplicationSettings appKey={appKey} />}
          />
          {app.supportsOauthClients && (
            <>
              <Route
                path="oauth-clients"
                element={<AdminApplicationOAuthClients appKey={appKey} />}
              />
              <Route
                path="oauth-clients/create"
                element={<AdminCreateOAuthClient appKey={appKey} />}
              />
              <Route
                path="oauth-clients/:oauthClientId"
                element={<AdminUpdateOAuthClient appKey={appKey} />}
              />
            </>
          )}
          <Route
            index
            element={<Navigate to={URLS.ADMIN_APP_SETTINGS(appKey)} replace />}
          />
        </Routes>
      </Container>
    </Box>
  );
}
