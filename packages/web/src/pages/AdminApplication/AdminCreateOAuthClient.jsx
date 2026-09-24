import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import Form from 'components/Form';
import Switch from 'components/Switch';
import TextField from 'components/TextField';
import * as URLS from 'config/urls';
import useAdminCreateAppConfig from 'hooks/useAdminCreateAppConfig';
import useAdminCreateOAuthClient from 'hooks/useAdminCreateOAuthClient';
import useAppAuth from 'hooks/useAppAuth';
import useAppConfig from 'hooks/useAppConfig';
import useFormatMessage from 'hooks/useFormatMessage';

export default function AdminCreateOAuthClient({ appKey }) {
  const formatMessage = useFormatMessage();
  const navigate = useNavigate();
  const { data: authData } = useAppAuth(appKey);
  const fields = authData?.data?.fields || [];
  const { data: appConfigData, isLoading: isAppConfigLoading } =
    useAppConfig(appKey);
  const { mutateAsync: createConfig, isPending: isCreatingConfig } =
    useAdminCreateAppConfig(appKey);
  const { mutateAsync: createClient, isPending: isCreatingClient } =
    useAdminCreateOAuthClient(appKey);

  const handleSubmit = async (values) => {
    if (!appConfigData?.data) {
      await createConfig({
        useOnlyPredefinedAuthClients: false,
        disabled: false,
      });
    }

    const { name, active, ...formattedAuthDefaults } = values;
    await createClient({
      name,
      active,
      formattedAuthDefaults,
    });
    navigate(URLS.ADMIN_APP_AUTH_CLIENTS(appKey));
  };

  const defaultValues = {
    name: '',
    active: false,
  };
  fields.forEach((field) => {
    defaultValues[field.key] = '';
  });

  return (
    <Form
      data-test="auth-client-form"
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      render={({ formState: { isDirty } }) => (
        <Stack gap={2}>
          <Switch
            name="active"
            label={formatMessage('oauthClient.inputActive')}
          />
          <TextField
            name="name"
            label={formatMessage('oauthClient.inputName')}
            fullWidth
            required
          />
          {fields.map((field) => (
            <TextField
              key={field.key}
              name={field.key}
              label={field.label || field.key}
              fullWidth
              type={field.type === 'password' ? 'password' : 'text'}
            />
          ))}
          <LoadingButton
            data-test="submit-auth-client-form"
            type="submit"
            variant="contained"
            color="primary"
            sx={{ boxShadow: 2 }}
            loading={isCreatingClient || isCreatingConfig}
            disabled={isAppConfigLoading || !isDirty}
          >
            {formatMessage('oauthClient.buttonSubmit')}
          </LoadingButton>
        </Stack>
      )}
    />
  );
}

AdminCreateOAuthClient.propTypes = {
  appKey: PropTypes.string.isRequired,
};
