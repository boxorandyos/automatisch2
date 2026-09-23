import * as React from 'react';
import PropTypes from 'prop-types';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import Form from 'components/Form';
import Switch from 'components/Switch';
import useAdminCreateAppConfig from 'hooks/useAdminCreateAppConfig';
import useAdminUpdateAppConfig from 'hooks/useAdminUpdateAppConfig';
import useAppConfig from 'hooks/useAppConfig';
import useFormatMessage from 'hooks/useFormatMessage';

export default function AdminApplicationSettings({ appKey }) {
  const formatMessage = useFormatMessage();
  const { data, isLoading } = useAppConfig(appKey);
  const appConfig = data?.data;
  const { mutateAsync: createConfig, isPending: isCreating } =
    useAdminCreateAppConfig(appKey);
  const { mutateAsync: updateConfig, isPending: isUpdating } =
    useAdminUpdateAppConfig(appKey);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (values) => {
    setSuccess(false);
    if (appConfig) {
      await updateConfig(values);
    } else {
      await createConfig(values);
    }
    setSuccess(true);
  };

  if (isLoading) {
    return null;
  }

  return (
    <Form
      defaultValues={{
        useOnlyPredefinedAuthClients:
          appConfig?.useOnlyPredefinedAuthClients || false,
        disabled: appConfig?.disabled || false,
      }}
      onSubmit={handleSubmit}
      render={() => (
        <Stack gap={2}>
          <Switch
            name="useOnlyPredefinedAuthClients"
            label={formatMessage(
              'adminAppsSettings.useOnlyPredefinedAuthClients',
            )}
          />
          <Switch
            name="disabled"
            label={formatMessage('adminAppsSettings.disabled')}
          />
          {success && (
            <Alert severity="success">
              {formatMessage('adminAppsSettings.successfullySaved')}
            </Alert>
          )}
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isCreating || isUpdating}
          >
            {formatMessage('adminAppsSettings.save')}
          </LoadingButton>
        </Stack>
      )}
    />
  );
}

AdminApplicationSettings.propTypes = {
  appKey: PropTypes.string.isRequired,
};
