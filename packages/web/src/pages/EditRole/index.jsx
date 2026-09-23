import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Container from 'components/Container';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import TextField from 'components/TextField';
import PermissionCatalogField from 'components/PermissionCatalogField';
import computePermissions, {
  permissionsToFormValues,
} from 'helpers/computePermissions';
import * as URLS from 'config/urls';
import useAdminUpdateRole from 'hooks/useAdminUpdateRole';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useFormatMessage from 'hooks/useFormatMessage';
import useRole from 'hooks/useRole';

const getValidationSchema = (formatMessage) =>
  yup.object().shape({
    name: yup
      .string()
      .trim()
      .required(
        formatMessage('roleForm.mandatoryInput', {
          inputName: formatMessage('roleForm.name'),
        }),
      ),
    description: yup.string().trim(),
  });

export default function EditRole() {
  const formatMessage = useFormatMessage();
  const { roleId } = useParams();
  const navigate = useNavigate();
  const enqueueSnackbar = useEnqueueSnackbar();
  const { data, isLoading } = useRole(roleId);
  const role = data?.data;
  const { mutateAsync: updateRole, isPending } = useAdminUpdateRole(roleId);

  const handleSubmit = async (values) => {
    try {
      await updateRole({
        name: values.name,
        description: values.description,
        permissions: computePermissions(values.permissions),
      });
      enqueueSnackbar(formatMessage('editRole.successfullyUpdated'), {
        variant: 'success',
      });
      navigate(URLS.ROLES);
    } catch (error) {
      const errors = error?.response?.data?.errors;
      throw errors || error;
    }
  };

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle>{formatMessage('editRolePage.title')}</PageTitle>
        </Grid>
        <Grid item xs={12} sx={{ pt: 5 }}>
          {isLoading && (
            <Stack gap={2}>
              <Skeleton variant="rounded" height={55} />
              <Skeleton variant="rounded" height={55} />
              <Skeleton variant="rounded" height={200} />
            </Stack>
          )}
          {!isLoading && role && (
            <Form
              onSubmit={handleSubmit}
              resolver={yupResolver(getValidationSchema(formatMessage))}
              defaultValues={{
                name: role.name,
                description: role.description || '',
                permissions: permissionsToFormValues(role.permissions || []),
              }}
              render={({ formState: { errors } }) => (
                <Stack direction="column" gap={2}>
                  <TextField
                    required
                    name="name"
                    label={formatMessage('roleForm.name')}
                    fullWidth
                  />
                  <TextField
                    name="description"
                    label={formatMessage('roleForm.description')}
                    fullWidth
                  />
                  <PermissionCatalogField name="permissions" />
                  {errors?.root?.general && (
                    <Alert severity="error">{errors.root.general.message}</Alert>
                  )}
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isPending}
                  >
                    {formatMessage('editRole.submit')}
                  </LoadingButton>
                </Stack>
              )}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
