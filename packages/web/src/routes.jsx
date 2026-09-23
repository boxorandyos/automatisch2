import { useEffect } from 'react';
import {
  Navigate,
  Routes as ReactRouterRoutes,
  Route,
  useNavigate,
} from 'react-router-dom';

import * as URLS from 'config/urls';
import AcceptInvitation from 'pages/AcceptInvitation';
import AdminSettingsLayout from 'components/AdminSettingsLayout';
import adminSettingsRoutes from './adminSettingsRoutes';
import Agent from 'pages/Agent';
import Agents from 'pages/Agents';
import Application from 'pages/Application';
import Applications from 'pages/Applications';
import EditorRoutes from 'pages/Editor/routes';
import Execution from 'pages/Execution';
import Executions from 'pages/Executions';
import Flows from 'pages/Flows';
import FormFlow from 'pages/FormFlow';
import Forms from 'pages/Forms';
import CreateForm from 'pages/CreateForm';
import EditForm from 'pages/EditForm';
import ForgotPassword from 'pages/ForgotPassword/index';
import Installation from 'pages/Installation';
import Layout from 'components/Layout';
import Login from 'pages/Login';
import LoginCallback from 'pages/LoginCallback';
import McpServer from 'pages/McpServer';
import McpServers from 'pages/McpServers';
import NoResultFound from 'components/NotFound';
import Notifications from 'pages/Notifications';
import PublicLayout from 'components/PublicLayout';
import ResetPassword from 'pages/ResetPassword/index';
import SignUp from 'pages/SignUp';
import settingsRoutes from './settingsRoutes';
import useAuthentication from 'hooks/useAuthentication';
import useAutomatischConfig from 'hooks/useAutomatischConfig';
import useAutomatischInfo from 'hooks/useAutomatischInfo';

function Routes() {
  const navigate = useNavigate();
  const { data: automatischInfo, isSuccess } = useAutomatischInfo();
  const { isAuthenticated } = useAuthentication();
  const { data: configData } = useAutomatischConfig();

  const config = configData?.data;
  const isEnterprise = automatischInfo?.data?.isEnterprise;

  const installed = isSuccess
    ? automatischInfo.data.installationCompleted
    : true;

  useEffect(() => {
    if (!installed) {
      navigate(URLS.INSTALLATION, { replace: true });
    }
  }, []);

  return (
    <ReactRouterRoutes>
      <Route
        path={URLS.EXECUTIONS}
        element={
          <Layout>
            <Executions />
          </Layout>
        }
      />

      <Route
        path={URLS.EXECUTION_PATTERN}
        element={
          <Layout>
            <Execution />
          </Layout>
        }
      />

      <Route
        path={`${URLS.FLOWS}/*`}
        element={
          <Layout>
            <Flows />
          </Layout>
        }
      />

      <Route
        path={`${URLS.APPS}/*`}
        element={
          <Layout>
            <Applications />
          </Layout>
        }
      />

      <Route
        path={`${URLS.APP_PATTERN}/*`}
        element={
          <Layout>
            <Application />
          </Layout>
        }
      />

      {(isEnterprise || isEnterprise === undefined) && (
        <>
          <Route
            path={URLS.FORMS}
            element={
              <Layout>
                <Forms />
              </Layout>
            }
          />

          <Route
            path={URLS.CREATE_FORM}
            element={
              <Layout>
                <CreateForm />
              </Layout>
            }
          />

          <Route
            path={URLS.FORM_PATTERN}
            element={
              <Layout>
                <EditForm />
              </Layout>
            }
          />

          <Route
            path={URLS.AGENTS}
            element={
              <Layout>
                <Agents />
              </Layout>
            }
          />

          <Route
            path={`${URLS.AGENT_PATTERN}/*`}
            element={
              <Layout>
                <Agent />
              </Layout>
            }
          />

          <Route
            path={URLS.MCP_SERVERS}
            element={
              <Layout>
                <McpServers />
              </Layout>
            }
          />

          <Route
            path={`${URLS.MCP_SERVER_PATTERN}/*`}
            element={
              <Layout>
                <McpServer />
              </Layout>
            }
          />
        </>
      )}

      <Route path={`${URLS.EDITOR}/*`} element={<EditorRoutes />} />

      <Route
        path={URLS.LOGIN}
        element={
          <PublicLayout>
            <Login />
          </PublicLayout>
        }
      />

      <Route
        path={URLS.SIGNUP}
        element={
          <PublicLayout>
            <SignUp />
          </PublicLayout>
        }
      />

      <Route
        path={URLS.PUBLIC_FORM_PATTERN}
        element={
          <PublicLayout>
            <FormFlow />
          </PublicLayout>
        }
      />

      <Route path={URLS.LOGIN_CALLBACK} element={<LoginCallback />} />

      <Route
        path={URLS.ACCEPT_INVITATON}
        element={
          <PublicLayout>
            <AcceptInvitation />
          </PublicLayout>
        }
      />

      <Route
        path={URLS.FORGOT_PASSWORD}
        element={
          <PublicLayout>
            <ForgotPassword />
          </PublicLayout>
        }
      />

      <Route
        path={URLS.RESET_PASSWORD}
        element={
          <PublicLayout>
            <ResetPassword />
          </PublicLayout>
        }
      />

      {!installed && (
        <Route
          path={URLS.INSTALLATION}
          element={
            <PublicLayout>
              <Installation />
            </PublicLayout>
          }
        />
      )}

      {!config?.disableNotificationsPage && (
        <Route
          path={URLS.UPDATES}
          element={
            <Layout>
              <Notifications />
            </Layout>
          }
        />
      )}

      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? URLS.FLOWS : URLS.LOGIN} replace />
        }
      />

      <Route path={URLS.SETTINGS}>{settingsRoutes}</Route>

      <Route path={URLS.ADMIN_SETTINGS} element={<AdminSettingsLayout />}>
        {adminSettingsRoutes}
      </Route>

      <Route path="*" element={<NoResultFound />} />
    </ReactRouterRoutes>
  );
}

export default <Routes />;
