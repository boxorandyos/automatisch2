import { Navigate, Route } from 'react-router-dom';

import AdminGuard from 'components/AdminGuard';
import EnterpriseAdminGuard from 'components/EnterpriseAdminGuard';
import * as URLS from 'config/urls';
import AdminApiTokens from 'pages/AdminApiTokens';
import AdminApplication from 'pages/AdminApplication';
import AdminApplications from 'pages/AdminApplications';
import AdminCreateTemplate from 'pages/AdminCreateTemplate';
import AdminTemplates from 'pages/AdminTemplates';
import AdminUpdateTemplate from 'pages/AdminUpdateTemplate';
import AiConfig from 'pages/AiConfig';
import Authentication from 'pages/Authentication';
import CreateRole from 'pages/CreateRole';
import CreateUser from 'pages/CreateUser';
import EditRole from 'pages/EditRole';
import EditUser from 'pages/EditUser';
import Roles from 'pages/Roles';
import UserInterface from 'pages/UserInterface';
import Users from 'pages/Users';

export default (
  <>
    <Route
      path={URLS.USERS}
      element={
        <AdminGuard>
          <Users />
        </AdminGuard>
      }
    />

    <Route
      path={URLS.CREATE_USER}
      element={
        <AdminGuard>
          <CreateUser />
        </AdminGuard>
      }
    />

    <Route
      path={URLS.USER_PATTERN}
      element={
        <AdminGuard>
          <EditUser />
        </AdminGuard>
      }
    />

    <Route
      path={URLS.ROLES}
      element={
        <EnterpriseAdminGuard>
          <Roles />
        </EnterpriseAdminGuard>
      }
    />

    <Route
      path={URLS.CREATE_ROLE}
      element={
        <EnterpriseAdminGuard>
          <CreateRole />
        </EnterpriseAdminGuard>
      }
    />

    <Route
      path={URLS.ROLE_PATTERN}
      element={
        <EnterpriseAdminGuard>
          <EditRole />
        </EnterpriseAdminGuard>
      }
    />

    <Route
      path={URLS.USER_INTERFACE}
      element={
        <EnterpriseAdminGuard>
          <UserInterface />
        </EnterpriseAdminGuard>
      }
    />

    <Route
      path={URLS.AUTHENTICATION}
      element={
        <EnterpriseAdminGuard>
          <Authentication />
        </EnterpriseAdminGuard>
      }
    />

    <Route
      path={URLS.AI_CONFIG}
      element={
        <EnterpriseAdminGuard>
          <AiConfig />
        </EnterpriseAdminGuard>
      }
    />

    <Route
      path={URLS.ADMIN_APPS}
      element={
        <EnterpriseAdminGuard>
          <AdminApplications />
        </EnterpriseAdminGuard>
      }
    />

    <Route
      path={`${URLS.ADMIN_APP_PATTERN}/*`}
      element={
        <EnterpriseAdminGuard>
          <AdminApplication />
        </EnterpriseAdminGuard>
      }
    />

    <Route
      path={URLS.ADMIN_TEMPLATES}
      element={
        <EnterpriseAdminGuard>
          <AdminTemplates />
        </EnterpriseAdminGuard>
      }
    />

    <Route
      path={URLS.ADMIN_CREATE_TEMPLATE_PATTERN}
      element={
        <EnterpriseAdminGuard>
          <AdminCreateTemplate />
        </EnterpriseAdminGuard>
      }
    />

    <Route
      path={URLS.ADMIN_UPDATE_TEMPLATE_PATTERN}
      element={
        <EnterpriseAdminGuard>
          <AdminUpdateTemplate />
        </EnterpriseAdminGuard>
      }
    />

    <Route
      path={URLS.ADMIN_API_TOKENS}
      element={
        <EnterpriseAdminGuard>
          <AdminApiTokens />
        </EnterpriseAdminGuard>
      }
    />

    <Route
      path={URLS.ADMIN_SETTINGS}
      element={<Navigate to={URLS.USERS} replace />}
    />
  </>
);
