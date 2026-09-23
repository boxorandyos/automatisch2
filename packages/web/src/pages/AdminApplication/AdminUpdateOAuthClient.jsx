import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
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
import useFormatMessage from 'hooks/useFormatMessage';

export default function AdminUpdateOAuthClient({ appKey }) {
  const formatMessage = useFormatMessage();
  const { oauthClientId } = useParams();
  const { data, isLoading } = useAdminOAuthClient(appKey, oauthClientId);
  const client = data?.data;
  const { data: authData } = useAppAuth(appKey);
  const fields = authData?.data?.fields || [];
  const { mutateAsync: updateClient, isPending } = useAdminUpdateOAuthClient(
    appKey,
    oauthClientId,
  );
  const [success, setSuccess] = React.useState(false);

  if (isLoading || !client) {
    return null;
  }

  const handleSubmit = async (values) => {
    setSuccess(false);
    const { name, active, ...formattedAuthDefaults } = values;
    await updateClient({
      name,
      active,
      formattedAuthDefaults,
    });
    setSuccess(true);
  };

  const defaultValues = {
    name: client.name || '',
    active: !!client.active,
    ...(client.formattedAuthDefaults || {}),
  };

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
          {success && (
            <Alert severity="success">
              {formatMessage('updateOAuthClient.success')}
            </Alert>
          )}
          <LoadingButton type="submit" variant="contained" loading={isPending}>
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
