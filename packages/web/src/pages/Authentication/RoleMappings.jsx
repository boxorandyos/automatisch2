import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import * as React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Form from 'components/Form';
import TextField from 'components/TextField';
import useAdminSamlAuthProviderRoleMappings from 'hooks/useAdminSamlAuthProviderRoleMappings';
import useAdminSamlAuthProviders from 'hooks/useAdminSamlAuthProviders';
import useAdminUpdateSamlAuthProviderRoleMappings from 'hooks/useAdminUpdateSamlAuthProviderRoleMappings';
import useFormatMessage from 'hooks/useFormatMessage';
import useRoles from 'hooks/useRoles';

function RoleMappingsFields() {
  const formatMessage = useFormatMessage();
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'roleMappings',
  });
  const { data: rolesData } = useRoles();
  const roles = rolesData?.data || [];

  return (
    <Stack gap={2}>
      <Typography variant="h6">
        {formatMessage('roleMappingsForm.title')}
      </Typography>

      {!fields.length && (
        <Typography color="text.secondary">
          {formatMessage('roleMappingsForm.notFound')}
        </Typography>
      )}

      {fields.map((field, index) => (
        <Stack direction="row" gap={1} key={field.id} alignItems="center">
          <TextField
            name={`roleMappings.${index}.remoteRoleName`}
            label={formatMessage('roleMappingsForm.remoteRoleName')}
            fullWidth
          />
          <TextField
            name={`roleMappings.${index}.roleId`}
            label={formatMessage('roleMappingsForm.role')}
            select
            fullWidth
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </TextField>
          <IconButton onClick={() => remove(index)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ))}

      <Button
        onClick={() => append({ remoteRoleName: '', roleId: '' })}
        sx={{ alignSelf: 'flex-start' }}
      >
        {formatMessage('roleMappingsForm.appendRoleMapping')}
      </Button>
    </Stack>
  );
}

export default function RoleMappings() {
  const formatMessage = useFormatMessage();
  const { data: providersData } = useAdminSamlAuthProviders();
  const provider = providersData?.data?.[0];
  const providerId = provider?.id;
  const { data, isLoading } =
    useAdminSamlAuthProviderRoleMappings(providerId);
  const mappings = data?.data || [];
  const { mutateAsync: updateMappings, isPending } =
    useAdminUpdateSamlAuthProviderRoleMappings(providerId);
  const [success, setSuccess] = React.useState(false);

  if (!providerId || isLoading) {
    return null;
  }

  const handleSubmit = async (values) => {
    setSuccess(false);
    await updateMappings({ roleMappings: values.roleMappings });
    setSuccess(true);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      defaultValues={{
        roleMappings: mappings.map((mapping) => ({
          remoteRoleName: mapping.remoteRoleName,
          roleId: mapping.roleId,
        })),
      }}
      render={() => (
        <Stack gap={2}>
          <RoleMappingsFields />
          {success && (
            <Alert severity="success">
              {formatMessage('roleMappingsForm.successfullySaved')}
            </Alert>
          )}
          <LoadingButton type="submit" variant="contained" loading={isPending}>
            {formatMessage('roleMappingsForm.save')}
          </LoadingButton>
        </Stack>
      )}
    />
  );
}
