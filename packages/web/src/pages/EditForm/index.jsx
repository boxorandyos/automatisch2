import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import * as React from 'react';
import { useParams } from 'react-router-dom';

import Container from 'components/Container';
import Form from 'components/Form';
import FormEditor from 'components/FormEditor';
import PageTitle from 'components/PageTitle';
import TextField from 'components/TextField';
import useFormatMessage from 'hooks/useFormatMessage';
import useForm from 'hooks/useForm';
import useUpdateForm from 'hooks/useUpdateForm';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';

export default function EditForm() {
  const formatMessage = useFormatMessage();
  const { formId } = useParams();
  const enqueueSnackbar = useEnqueueSnackbar();
  const { data, isLoading } = useForm(formId);
  const form = data?.data;
  const { mutateAsync: updateForm, isPending } = useUpdateForm(formId);

  if (isLoading || !form) {
    return null;
  }

  const handleSubmit = async (values) => {
    const fields = (values.fields || []).map((field) => {
      const next = { ...field };
      if (typeof next.options === 'string') {
        next.options = next.options
          .split(',')
          .map((option) => option.trim())
          .filter(Boolean);
      }
      return next;
    });

    await updateForm({ ...values, fields });
    enqueueSnackbar('Form updated', { variant: 'success' });
  };

  const fields = (form.fields || []).map((field) => ({
    ...field,
    options: Array.isArray(field.options)
      ? field.options.join(', ')
      : field.options || '',
  }));

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle>{formatMessage('editFormPage.title')}</PageTitle>
        </Grid>
        <Grid item xs={12}>
          <Form
            onSubmit={handleSubmit}
            defaultValues={{
              name: form.name || '',
              displayName: form.displayName || '',
              description: form.description || '',
              responseMessage: form.responseMessage || '',
              submitButtonText: form.submitButtonText || '',
              fields,
            }}
            render={() => (
              <Stack gap={2}>
                <TextField
                  name="name"
                  label={formatMessage('editFormForm.name')}
                  fullWidth
                  required
                />
                <TextField
                  name="displayName"
                  label={formatMessage('editFormForm.displayName')}
                  fullWidth
                />
                <TextField
                  name="description"
                  label={formatMessage('editFormForm.description')}
                  fullWidth
                  multiline
                  minRows={2}
                />
                <TextField
                  name="responseMessage"
                  label={formatMessage('editFormForm.responseMessage')}
                  fullWidth
                />
                <TextField
                  name="submitButtonText"
                  label={formatMessage('editFormForm.submitButtonText')}
                  fullWidth
                />
                <FormEditor name="fields" />
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isPending}
                >
                  {formatMessage('editFormForm.buttonSubmit')}
                </LoadingButton>
              </Stack>
            )}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
