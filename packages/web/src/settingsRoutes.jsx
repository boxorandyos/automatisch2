import { Route, Navigate } from 'react-router-dom';

import SettingsLayout from 'components/SettingsLayout';
import BillingAndUsageSettings from 'pages/BillingAndUsageSettings';
import PlanUpgrade from 'pages/PlanUpgrade';
import ProfileSettings from 'pages/ProfileSettings';
import * as URLS from 'config/urls';
import useCloud from 'hooks/useCloud';

function CloudBillingAndUsageSettings() {
  const isCloud = useCloud();

  if (isCloud === false) {
    return <Navigate to={URLS.SETTINGS_PROFILE} replace />;
  }

  return (
    <SettingsLayout>
      <BillingAndUsageSettings />
    </SettingsLayout>
  );
}

function CloudPlanUpgrade() {
  const isCloud = useCloud();

  if (isCloud === false) {
    return <Navigate to={URLS.SETTINGS_PROFILE} replace />;
  }

  return (
    <SettingsLayout>
      <PlanUpgrade />
    </SettingsLayout>
  );
}

export default (
  <>
    <Route
      path={URLS.SETTINGS_PROFILE}
      element={
        <SettingsLayout>
          <ProfileSettings />
        </SettingsLayout>
      }
    />

    <Route
      path={URLS.SETTINGS_BILLING_AND_USAGE}
      element={<CloudBillingAndUsageSettings />}
    />

    <Route
      path={URLS.SETTINGS_PLAN_UPGRADE}
      element={<CloudPlanUpgrade />}
    />

    <Route
      path={URLS.SETTINGS}
      element={<Navigate to={URLS.SETTINGS_PROFILE} replace />}
    />
  </>
);
