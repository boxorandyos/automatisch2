import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import Container from 'components/Container';
import Form from 'components/Form';
import FormEditor from 'components/FormEditor';
import PageTitle from 'components/PageTitle';
import TextField from 'components/TextField';
import * as URLS from 'config/urls';
import useCreateForm from 'hooks/useCreateForm';
import useFormatMessage from 'hooks/useFormatMessage';

export default function CreateForm() {
  const formatMessage = useFormatMessage();
  const navigate = useNavigate();
  const { mutateAsync: createForm, isPending } = useCreateForm();

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

    const response = await createForm({ ...values, fields });
    const formId = response?.data?.id;
    navigate(formId ? URLS.EDIT_FORM(formId) : URLS.FORMS);
  };

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle>{formatMessage('createFormPage.title')}</PageTitle>
        </Grid>
        <Grid item xs={12}>
          <Form
            onSubmit={handleSubmit}
            defaultValues={{
              name: '',
              displayName: '',
              description: '',
              responseMessage: '',
              submitButtonText: '',
              fields: [],
            }}
            render={() => (
              <Stack gap={2}>
                <TextField
                  name="name"
                  label={formatMessage('createFormForm.name')}
                  fullWidth
                  required
                />
                <TextField
                  name="displayName"
                  label={formatMessage('createFormForm.displayName')}
                  fullWidth
                />
                <TextField
                  name="description"
                  label={formatMessage('createFormForm.description')}
                  fullWidth
                  multiline
                  minRows={2}
                />
                <TextField
                  name="responseMessage"
                  label={formatMessage('createFormForm.responseMessage')}
                  fullWidth
                />
                <TextField
                  name="submitButtonText"
                  label={formatMessage('createFormForm.submitButtonText')}
                  fullWidth
                />
                <FormEditor name="fields" />
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isPending}
                >
                  {formatMessage('createFormForm.buttonSubmit')}
                </LoadingButton>
              </Stack>
            )}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
