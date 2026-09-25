import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import * as React from 'react';
import { useParams } from 'react-router-dom';

import Container from 'components/Container';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import TextField from 'components/TextField';
import useAdminTemplate from 'hooks/useAdminTemplate';
import useAdminUpdateTemplate from 'hooks/useAdminUpdateTemplate';
import useFormatMessage from 'hooks/useFormatMessage';

export default function AdminUpdateTemplate() {
  const formatMessage = useFormatMessage();
  const { templateId } = useParams();
  const {
    data,
    isLoading: isTemplateLoading,
    isError: isTemplateError,
    error: templateError,
  } = useAdminTemplate(templateId);
  const template = data?.data;
  const {
    mutateAsync: updateTemplate,
    isPending,
    isError: isUpdateTemplateError,
    error: updateTemplateError,
  } = useAdminUpdateTemplate(templateId);

  const handleSubmit = async (values) => {
    await updateTemplate({ name: values.name });
  };

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle>{formatMessage('adminTemplatePage.title')}</PageTitle>
        </Grid>
        <Grid item xs={12}>
          {!isTemplateLoading && (
            <Form
              onSubmit={handleSubmit}
              defaultValues={{ name: template?.name || '' }}
              render={() => (
                <Stack gap={2}>
                  <TextField
                    name="name"
                    label={formatMessage('adminUpdateTemplate.titleFieldLabel')}
                    fullWidth
                    required
                    disabled={!template}
                    data-test="template-name-input"
                  />
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isPending}
                    disabled={!template}
                    data-test="update-button"
                  >
                    {formatMessage('adminUpdateTemplate.submit')}
                  </LoadingButton>
                </Stack>
              )}
            />
          )}
          {(isTemplateError || isUpdateTemplateError) && (
            <Alert severity="error" sx={{ mt: 3 }} data-test="update-alert">
              {templateError?.message ||
                updateTemplateError?.message ||
                formatMessage('genericError')}
            </Alert>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
