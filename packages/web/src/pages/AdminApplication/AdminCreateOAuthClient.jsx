import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import Form from 'components/Form';
import Switch from 'components/Switch';
import TextField from 'components/TextField';
import * as URLS from 'config/urls';
import useAdminCreateOAuthClient from 'hooks/useAdminCreateOAuthClient';
import useAppAuth from 'hooks/useAppAuth';
import useFormatMessage from 'hooks/useFormatMessage';

export default function AdminCreateOAuthClient({ appKey }) {
  const formatMessage = useFormatMessage();
  const navigate = useNavigate();
  const { data: authData } = useAppAuth(appKey);
  const fields = authData?.data?.fields || [];
  const { mutateAsync: createClient, isPending } =
    useAdminCreateOAuthClient(appKey);

  const handleSubmit = async (values) => {
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
    active: true,
  };
  fields.forEach((field) => {
    defaultValues[field.key] = '';
  });

  return (
    <Form
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      render={() => (
        <Stack gap={2}>
          <TextField
            name="name"
            label={formatMessage('oauthClient.inputName')}
            fullWidth
            required
          />
          <Switch
            name="active"
            label={formatMessage('oauthClient.inputActive')}
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
          <LoadingButton type="submit" variant="contained" loading={isPending}>
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
