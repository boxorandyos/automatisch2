import PropTypes from 'prop-types';
import * as React from 'react';
import {
  Link,
  Route,
  Navigate,
  Routes,
  useParams,
  useMatch,
  useNavigate,
} from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AddIcon from '@mui/icons-material/Add';

import useFormatMessage from 'hooks/useFormatMessage';
import useCurrentUserAbility from 'hooks/useCurrentUserAbility';
import * as URLS from 'config/urls';
import ConditionalIconButton from 'components/ConditionalIconButton';
import AppConnections from 'components/AppConnections';
import AppFlows from 'components/AppFlows';
import AddAppConnection from 'components/AddAppConnection';
import AppIcon from 'components/AppIcon';
import Container from 'components/Container';
import OAuthClientsDialog from 'components/OAuthClientsDialog';
import PageTitle from 'components/PageTitle';
import useApp from 'hooks/useApp';
import useAppConfig from 'hooks/useAppConfig';
import useOAuthClients from 'hooks/useOAuthClients';
import Can from 'components/Can';
import { AppPropType } from 'propTypes/propTypes';

const ReconnectConnection = (props) => {
  const { application, onClose } = props;
  const { connectionId } = useParams();

  return (
    <AddAppConnection
      onClose={onClose}
      application={application}
      connectionId={connectionId}
    />
  );
};

ReconnectConnection.propTypes = {
  application: AppPropType.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default function Application() {
  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('md'));
  const formatMessage = useFormatMessage();
  const connectionsPathMatch = useMatch({
    path: URLS.APP_CONNECTIONS_PATTERN,
    end: false,
  });
  const flowsPathMatch = useMatch({ path: URLS.APP_FLOWS_PATTERN, end: false });
  const { appKey } = useParams();
  const navigate = useNavigate();

  const { data, loading } = useApp(appKey);
  const app = data?.data || {};
  const { data: appConfigData } = useAppConfig(appKey);
  const appConfig = appConfigData?.data;
  const { data: oauthClientsData } = useOAuthClients(appKey);
  const oauthClients = (oauthClientsData?.data || []).filter(
    (client) => client.active,
  );
  const [oauthDialogOpen, setOauthDialogOpen] = React.useState(false);

  const currentUserAbility = useCurrentUserAbility();

  const goToApplicationPage = () => navigate('connections');

  const handleAddConnection = React.useCallback(() => {
    if (appConfig?.useOnlyPredefinedAuthClients && oauthClients.length) {
      setOauthDialogOpen(true);
      return;
    }
    navigate(URLS.APP_ADD_CONNECTION(appKey));
  }, [appConfig?.useOnlyPredefinedAuthClients, appKey, navigate, oauthClients.length]);

  const handleOAuthClientClick = React.useCallback(
    (client) => {
      setOauthDialogOpen(false);
      navigate(URLS.APP_ADD_CONNECTION_WITH_OAUTH_CLIENT_ID(appKey, client.id));
    },
    [appKey, navigate],
  );

  if (loading) return null;

  return (
    <>
      <Box sx={{ py: 3 }}>
        <Container>
          <Grid container sx={{ mb: 3 }} alignItems="center">
            <Grid item xs="auto" sx={{ mr: 3 }}>
              <AppIcon
                url={app.iconUrl}
                color={app.primaryColor}
                name={app.name}
              />
            </Grid>

            <Grid item xs>
              <PageTitle>{app.name}</PageTitle>
            </Grid>

            <Grid item xs="auto">
              <Routes>
                <Route
                  path={`${URLS.FLOWS}/*`}
                  element={
                    <Can I="manage" a="Flow" passThrough>
                      {(allowed) => (
                        <ConditionalIconButton
                          type="submit"
                          variant="contained"
                          color="primary"
                          size="large"
                          component={Link}
                          to={URLS.CREATE_FLOW}
                          fullWidth
                          icon={<AddIcon />}
                          disabled={!allowed}
                        >
                          {formatMessage('app.createFlow')}
                        </ConditionalIconButton>
                      )}
                    </Can>
                  }
                />

                <Route
                  path={`${URLS.CONNECTIONS}/*`}
                  element={
                    <Can I="manage" a="Connection" passThrough>
                      {(allowed) => (
                        <ConditionalIconButton
                          type="submit"
                          variant="contained"
                          color="primary"
                          size="large"
                          fullWidth
                          icon={<AddIcon />}
                          disabled={!allowed}
                          data-test="add-connection-button"
                          onClick={handleAddConnection}
                          {...(!(
                            appConfig?.useOnlyPredefinedAuthClients &&
                            oauthClients.length
                          )
                            ? {
                                component: Link,
                                to: URLS.APP_ADD_CONNECTION(appKey),
                              }
                            : {})}
                        >
                          {formatMessage('app.addConnection')}
                        </ConditionalIconButton>
                      )}
                    </Can>
                  }
                />
              </Routes>
            </Grid>
          </Grid>

          {oauthDialogOpen && (
            <OAuthClientsDialog
              appKey={appKey}
              onClose={() => setOauthDialogOpen(false)}
              onClientClick={handleOAuthClientClick}
            />
          )}

          <Grid container>
            <Grid item xs>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs
                  variant={matchSmallScreens ? 'fullWidth' : undefined}
                  value={
                    connectionsPathMatch?.pattern?.path ||
                    flowsPathMatch?.pattern?.path
                  }
                >
                  <Tab
                    label={formatMessage('app.connections')}
                    to={URLS.APP_CONNECTIONS(appKey)}
                    value={URLS.APP_CONNECTIONS_PATTERN}
                    disabled={
                      !currentUserAbility.can('read', 'Connection') ||
                      !app.supportsConnections
                    }
                    component={Link}
                    data-test="connections-tab"
                  />
                  <Tab
                    label={formatMessage('app.flows')}
                    to={URLS.APP_FLOWS(appKey)}
                    value={URLS.APP_FLOWS_PATTERN}
                    component={Link}
                    data-test="flows-tab"
                    disabled={!currentUserAbility.can('read', 'Flow')}
                  />
                </Tabs>
              </Box>

              <Routes>
                <Route
                  path={`${URLS.FLOWS}/*`}
                  element={
                    <Can I="read" a="Flow">
                      <AppFlows appKey={appKey} />
                    </Can>
                  }
                />
                <Route
                  path={`${URLS.CONNECTIONS}/*`}
                  element={
                    <Can I="read" a="Connection">
                      <AppConnections appKey={appKey} />
                    </Can>
                  }
                />
                <Route
                  path="/"
                  element={
                    <Navigate
                      to={
                        app.supportsConnections
                          ? URLS.APP_CONNECTIONS(appKey)
                          : URLS.APP_FLOWS(appKey)
                      }
                      replace
                    />
                  }
                />
              </Routes>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Routes>
        <Route
          path="/connections/add"
          element={
            <Can I="manage" a="Connection">
              <AddAppConnection
                onClose={goToApplicationPage}
                application={app}
              />
            </Can>
          }
        />

        <Route
          path="/connections/:connectionId/reconnect"
          element={
            <Can I="manage" a="Connection">
              <ReconnectConnection
                application={app}
                onClose={goToApplicationPage}
              />
            </Can>
          }
        />
      </Routes>
    </>
  );
}
