import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useParams } from 'react-router-dom';

import Form from 'components/Form';
import Switch from 'components/Switch';
import TextField from 'components/TextField';
import useAdminOAuthClient from 'hooks/useAdminOAuthClient';
import useAdminUpdateOAuthClient from 'hooks/useAdminUpdateOAuthClient';
import useAppAuth from 'hooks/useAppAuth';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useFormatMessage from 'hooks/useFormatMessage';

export default function AdminUpdateOAuthClient({ appKey }) {
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
  const { oauthClientId } = useParams();
  const { data, isLoading } = useAdminOAuthClient(appKey, oauthClientId);
  const client = data?.data;
  const { data: authData } = useAppAuth(appKey);
  const fields = authData?.data?.fields || [];
  const { mutateAsync: updateClient, isPending } = useAdminUpdateOAuthClient(
    appKey,
    oauthClientId,
  );

  if (isLoading || !client) {
    return null;
  }

  const handleSubmit = async (values) => {
    const { name, active, ...formattedAuthDefaults } = values;
    await updateClient({
      name,
      active,
      formattedAuthDefaults,
    });
    enqueueSnackbar(formatMessage('updateOAuthClient.success'), {
      variant: 'success',
    });
  };

  const defaultValues = {
    name: client.name || '',
    active: !!client.active,
    ...(client.formattedAuthDefaults || {}),
  };

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
            loading={isPending}
            disabled={!isDirty}
          >
            {formatMessage('oauthClient.buttonSubmit')}
          </LoadingButton>
        </Stack>
      )}
    />
  );
}

AdminUpdateOAuthClient.propTypes = {
  appKey: PropTypes.string.isRequired,
};
