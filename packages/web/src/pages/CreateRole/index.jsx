import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Container from 'components/Container';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import TextField from 'components/TextField';
import PermissionCatalogField from 'components/PermissionCatalogField';
import computePermissions from 'helpers/computePermissions';
import * as URLS from 'config/urls';
import useAdminCreateRole from 'hooks/useAdminCreateRole';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useFormatMessage from 'hooks/useFormatMessage';

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

export default function CreateRole() {
  const formatMessage = useFormatMessage();
  const navigate = useNavigate();
  const enqueueSnackbar = useEnqueueSnackbar();
  const { mutateAsync: createRole, isPending } = useAdminCreateRole();

  const handleSubmit = async (values) => {
    try {
      await createRole({
        name: values.name,
        description: values.description,
        permissions: computePermissions(values.permissions),
      });
      enqueueSnackbar(formatMessage('createRole.successfullyCreated'), {
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
          <PageTitle data-test="create-role-title">
            {formatMessage('createRolePage.title')}
          </PageTitle>
        </Grid>
        <Grid item xs={12} sx={{ pt: 5 }}>
          <Form
            onSubmit={handleSubmit}
            resolver={yupResolver(getValidationSchema(formatMessage))}
            defaultValues={{ name: '', description: '', permissions: {} }}
            render={({ formState: { errors } }) => (
              <Stack direction="column" gap={2}>
                <TextField
                  required
                  name="name"
                  label={formatMessage('roleForm.name')}
                  data-test="name-input"
                  fullWidth
                />
                <TextField
                  name="description"
                  label={formatMessage('roleForm.description')}
                  data-test="description-input"
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
                  data-test="create-button"
                >
                  {formatMessage('createRole.submit')}
                </LoadingButton>
              </Stack>
            )}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
