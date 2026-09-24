import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Container from 'components/Container';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import TextField from 'components/TextField';
import * as URLS from 'config/urls';
import useAdminTemplate from 'hooks/useAdminTemplate';
import useAdminUpdateTemplate from 'hooks/useAdminUpdateTemplate';
import useFormatMessage from 'hooks/useFormatMessage';

export default function AdminUpdateTemplate() {
  const formatMessage = useFormatMessage();
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useAdminTemplate(templateId);
  const template = data?.data;
  const {
    mutateAsync: updateTemplate,
    isPending,
    error,
  } = useAdminUpdateTemplate(templateId);

  if (isLoading || !template) {
    return null;
  }

  const handleSubmit = async (values) => {
    await updateTemplate({ name: values.name });
    navigate(URLS.ADMIN_TEMPLATES);
  };

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle>{formatMessage('adminTemplatePage.title')}</PageTitle>
        </Grid>
        <Grid item xs={12}>
          <Form
            onSubmit={handleSubmit}
            defaultValues={{ name: template.name || '' }}
            render={() => (
              <Stack gap={2}>
                <TextField
                  name="name"
                  label={formatMessage('adminUpdateTemplate.titleFieldLabel')}
                  fullWidth
                  required
                  data-test="template-name-input"
                />
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isPending}
                  data-test="update-button"
                >
                  {formatMessage('adminUpdateTemplate.submit')}
                </LoadingButton>
                {error && (
                  <Alert severity="error" sx={{ mt: 3 }} data-test="update-alert">
                    {error?.response?.data?.errors?.general?.[0] ||
                      error.message}
                  </Alert>
                )}
              </Stack>
            )}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
