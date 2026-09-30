import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import Container from 'components/Container';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import TextField from 'components/TextField';
import useAdminUpdateConfig from 'hooks/useAdminUpdateConfig';
import useAutomatischConfig from 'hooks/useAutomatischConfig';
import useFormatMessage from 'hooks/useFormatMessage';

const PROVIDERS = [
  { value: '', labelKey: 'aiConfigPage.noProvider' },
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
];

export default function AiConfig() {
  const formatMessage = useFormatMessage();
  const { data, isLoading } = useAutomatischConfig();
  const config = data?.data || {};
  const { mutateAsync: updateConfig, isPending } = useAdminUpdateConfig();
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (values) => {
    setSuccess(false);
    const payload = {
      defaultAiProvider: values.defaultAiProvider || null,
    };
    if (values.defaultAiProviderKey) {
      payload.defaultAiProviderKey = values.defaultAiProviderKey;
    }
    await updateConfig(payload);
    setSuccess(true);
  };

  if (isLoading) {
    return null;
  }

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle>{formatMessage('aiConfigPage.title')}</PageTitle>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {formatMessage('aiConfigPage.description')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Form
            onSubmit={handleSubmit}
            defaultValues={{
              defaultAiProvider: config.defaultAiProvider || '',
              defaultAiProviderKey: '',
            }}
            render={() => (
              <Stack gap={2}>
                <Typography variant="h6">
                  {formatMessage('aiConfigPage.subtitle')}
                </Typography>
                <TextField
                  name="defaultAiProvider"
                  label={formatMessage('aiConfigPage.providerFieldLabel')}
                  select
                  fullWidth
                >
                  {PROVIDERS.map((provider) => (
                    <MenuItem key={provider.value || 'none'} value={provider.value}>
                      {provider.labelKey
                        ? formatMessage(provider.labelKey)
                        : provider.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  name="defaultAiProviderKey"
                  label={formatMessage('aiConfigPage.apiKeyFieldLabel')}
                  helperText={formatMessage('aiConfigPage.apiKeyHelperText')}
                  fullWidth
                  type="password"
                />
                <Alert severity="info">
                  {formatMessage('aiConfigPage.apiKeyPersistenceNote')}
                </Alert>
                {success && (
                  <Alert severity="success">
                    {formatMessage('aiConfigPage.successfullyUpdated')}
                  </Alert>
                )}
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isPending}
                >
                  {formatMessage('aiConfigPage.submit')}
                </LoadingButton>
              </Stack>
            )}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
