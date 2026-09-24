import * as React from 'react';
import PropTypes from 'prop-types';
import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

import Form from 'components/Form';
import Switch from 'components/Switch';
import useAdminCreateAppConfig from 'hooks/useAdminCreateAppConfig';
import useAdminUpdateAppConfig from 'hooks/useAdminUpdateAppConfig';
import useApp from 'hooks/useApp';
import useAppConfig from 'hooks/useAppConfig';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useFormatMessage from 'hooks/useFormatMessage';

export default function AdminApplicationSettings({ appKey }) {
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
  const { data: appData, isLoading: appLoading } = useApp(appKey);
  const app = appData?.data || {};
  const { data, isLoading } = useAppConfig(appKey);
  const appConfig = data?.data;
  const { mutateAsync: createConfig, isPending: isCreating } =
    useAdminCreateAppConfig(appKey);
  const { mutateAsync: updateConfig, isPending: isUpdating } =
    useAdminUpdateAppConfig(appKey);

  const handleSubmit = async (values) => {
    try {
      if (appConfig) {
        await updateConfig(values);
      } else {
        await createConfig(values);
      }

      enqueueSnackbar(formatMessage('adminAppsSettings.successfullySaved'), {
        variant: 'success',
        SnackbarProps: {
          'data-test': 'snackbar-save-admin-apps-settings-success',
        },
      });
    } catch (error) {
      const errors = error?.response?.data?.errors;
      throw errors || error;
    }
  };

  const defaultValues = React.useMemo(
    () => ({
      ...(app.supportsOauthClients && {
        useOnlyPredefinedAuthClients:
          appConfig?.useOnlyPredefinedAuthClients || false,
      }),
      disabled: appConfig?.disabled || false,
    }),
    [appConfig, app.supportsOauthClients],
  );

  if (isLoading || appLoading) {
    return null;
  }

  return (
    <Form
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      render={({ formState: { isDirty } }) => (
        <Paper sx={{ p: 2, mt: 4 }}>
          <Stack spacing={2} direction="column">
            {app.supportsOauthClients && (
              <>
                <Switch
                  name="useOnlyPredefinedAuthClients"
                  label={formatMessage(
                    'adminAppsSettings.useOnlyPredefinedAuthClients',
                  )}
                  FormControlLabelProps={{
                    labelPlacement: 'start',
                  }}
                />
                <Divider />
              </>
            )}

            <Switch
              name="disabled"
              label={formatMessage('adminAppsSettings.disabled')}
              FormControlLabelProps={{
                labelPlacement: 'start',
              }}
            />
            <Divider />
          </Stack>

          <Stack>
            <LoadingButton
              data-test="submit-button"
              type="submit"
              variant="contained"
              color="primary"
              sx={{ boxShadow: 2, mt: 5 }}
              loading={isCreating || isUpdating}
              disabled={!isDirty || isLoading || appLoading}
            >
              {formatMessage('adminAppsSettings.save')}
            </LoadingButton>
          </Stack>
        </Paper>
      )}
    />
  );
}

AdminApplicationSettings.propTypes = {
  appKey: PropTypes.string.isRequired,
};
