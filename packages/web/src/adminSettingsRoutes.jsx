import { Navigate, Route } from 'react-router-dom';

import AdminGuard from 'components/AdminGuard';
import * as URLS from 'config/urls';
import CreateUser from 'pages/CreateUser';
import EditUser from 'pages/EditUser';
import Users from 'pages/Users';

// TODO: consider introducing redirections to `/` as fallback
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
      path={URLS.ADMIN_SETTINGS}
      element={<Navigate to={URLS.USERS} replace />}
    />
  </>
);
