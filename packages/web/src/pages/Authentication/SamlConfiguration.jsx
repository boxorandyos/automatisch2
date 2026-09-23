import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import * as React from 'react';

import Form from 'components/Form';
import Switch from 'components/Switch';
import TextField from 'components/TextField';
import useAdminCreateSamlAuthProvider from 'hooks/useAdminCreateSamlAuthProvider';
import useAdminSamlAuthProviders from 'hooks/useAdminSamlAuthProviders';
import useAdminUpdateSamlAuthProvider from 'hooks/useAdminUpdateSamlAuthProvider';
import useFormatMessage from 'hooks/useFormatMessage';
import useRoles from 'hooks/useRoles';

export default function SamlConfiguration() {
  const formatMessage = useFormatMessage();
  const { data, isLoading } = useAdminSamlAuthProviders();
  const providers = data?.data || [];
  const provider = providers[0];
  const { data: rolesData } = useRoles();
  const roles = rolesData?.data || [];
  const { mutateAsync: createProvider, isPending: isCreating } =
    useAdminCreateSamlAuthProvider();
  const { mutateAsync: updateProvider, isPending: isUpdating } =
    useAdminUpdateSamlAuthProvider(provider?.id);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (values) => {
    setSuccess(false);
    if (provider?.id) {
      await updateProvider(values);
    } else {
      await createProvider(values);
    }
    setSuccess(true);
  };

  if (isLoading) {
    return null;
  }

  return (
    <Form
      onSubmit={handleSubmit}
      defaultValues={{
        active: provider?.active || false,
        name: provider?.name || '',
        certificate: provider?.certificate || '',
        signatureAlgorithm: provider?.signatureAlgorithm || 'sha256',
        issuer: provider?.issuer || '',
        entryPoint: provider?.entryPoint || '',
        firstnameAttributeName: provider?.firstnameAttributeName || '',
        surnameAttributeName: provider?.surnameAttributeName || '',
        emailAttributeName: provider?.emailAttributeName || '',
        roleAttributeName: provider?.roleAttributeName || '',
        defaultRoleId: provider?.defaultRoleId || '',
      }}
      render={() => (
        <Stack gap={2}>
          <Switch
            name="active"
            label={formatMessage('authenticationForm.active')}
          />
          <TextField
            name="name"
            label={formatMessage('authenticationForm.name')}
            fullWidth
            required
          />
          <TextField
            name="certificate"
            label={formatMessage('authenticationForm.certificate')}
            fullWidth
            multiline
            minRows={3}
            required
          />
          <TextField
            name="signatureAlgorithm"
            label={formatMessage('authenticationForm.signatureAlgorithm')}
            select
            fullWidth
          >
            <MenuItem value="sha1">sha1</MenuItem>
            <MenuItem value="sha256">sha256</MenuItem>
            <MenuItem value="sha512">sha512</MenuItem>
          </TextField>
          <TextField
            name="issuer"
            label={formatMessage('authenticationForm.issuer')}
            fullWidth
            required
          />
          <TextField
            name="entryPoint"
            label={formatMessage('authenticationForm.entryPoint')}
            fullWidth
            required
          />
          <TextField
            name="firstnameAttributeName"
            label={formatMessage('authenticationForm.firstnameAttributeName')}
            fullWidth
          />
          <TextField
            name="surnameAttributeName"
            label={formatMessage('authenticationForm.surnameAttributeName')}
            fullWidth
          />
          <TextField
            name="emailAttributeName"
            label={formatMessage('authenticationForm.emailAttributeName')}
            fullWidth
          />
          <TextField
            name="roleAttributeName"
            label={formatMessage('authenticationForm.roleAttributeName')}
            fullWidth
          />
          <TextField
            name="defaultRoleId"
            label={formatMessage('authenticationForm.defaultRole')}
            select
            fullWidth
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </TextField>
          {success && (
            <Alert severity="success">
              {formatMessage('authenticationForm.successfullySaved')}
            </Alert>
          )}
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isCreating || isUpdating}
          >
            {formatMessage('authenticationForm.save')}
          </LoadingButton>
        </Stack>
      )}
    />
  );
}
