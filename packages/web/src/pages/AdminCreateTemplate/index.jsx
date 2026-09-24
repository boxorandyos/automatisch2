import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Container from 'components/Container';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import TextField from 'components/TextField';
import * as URLS from 'config/urls';
import useAdminCreateTemplate from 'hooks/useAdminCreateTemplate';
import useFormatMessage from 'hooks/useFormatMessage';

export default function AdminCreateTemplate() {
  const formatMessage = useFormatMessage();
  const { flowId } = useParams();
  const navigate = useNavigate();
  const { mutateAsync: createTemplate, isPending } = useAdminCreateTemplate();

  const handleSubmit = async (values) => {
    await createTemplate({ name: values.name, flowId });
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
            defaultValues={{ name: '' }}
            render={() => (
              <Stack gap={2}>
                <TextField
                  name="name"
                  label={formatMessage('adminCreateTemplate.titleFieldLabel')}
                  fullWidth
                  required
                  data-test="template-name-input"
                />
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isPending}
                  data-test="create-button"
                >
                  {formatMessage('adminCreateTemplate.submit')}
                </LoadingButton>
              </Stack>
            )}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
