import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import ColorInput from 'components/ColorInput';
import Container from 'components/Container';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import Switch from 'components/Switch';
import TextField from 'components/TextField';
import useAdminUpdateConfig from 'hooks/useAdminUpdateConfig';
import useAutomatischConfig from 'hooks/useAutomatischConfig';
import useFormatMessage from 'hooks/useFormatMessage';

export default function UserInterface() {
  const formatMessage = useFormatMessage();
  const { data, isLoading } = useAutomatischConfig();
  const config = data?.data || {};
  const { mutateAsync: updateConfig, isPending } = useAdminUpdateConfig();
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (values) => {
    setSuccess(false);
    await updateConfig(values);
    setSuccess(true);
  };

  if (isLoading) {
    return null;
  }

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle>{formatMessage('userInterfacePage.title')}</PageTitle>
        </Grid>
        <Grid item xs={12}>
          <Form
            onSubmit={handleSubmit}
            defaultValues={{
              title: config.title || '',
              palettePrimaryMain: config.palettePrimaryMain || '',
              palettePrimaryDark: config.palettePrimaryDark || '',
              palettePrimaryLight: config.palettePrimaryLight || '',
              logoSvgData: config.logoSvgData || '',
              enableFooter: !!config.enableFooter,
              footerLogoSvgData: config.footerLogoSvgData || '',
              footerCopyrightText: config.footerCopyrightText || '',
              footerBackgroundColor: config.footerBackgroundColor || '',
              footerTextColor: config.footerTextColor || '',
              footerDocsUrl: config.footerDocsUrl || '',
              footerTosUrl: config.footerTosUrl || '',
              footerPrivacyPolicyUrl: config.footerPrivacyPolicyUrl || '',
              footerImprintUrl: config.footerImprintUrl || '',
            }}
            render={() => (
              <Stack gap={3}>
                <Typography variant="h6">
                  {formatMessage('userInterfacePage.generalTitle')}
                </Typography>
                <TextField
                  name="title"
                  label={formatMessage('userInterfacePage.titleFieldLabel')}
                  fullWidth
                />
                <ColorInput
                  name="palettePrimaryMain"
                  label={formatMessage(
                    'userInterfacePage.primaryMainColorFieldLabel',
                  )}
                  fullWidth
                />
                <ColorInput
                  name="palettePrimaryDark"
                  label={formatMessage(
                    'userInterfacePage.primaryDarkColorFieldLabel',
                  )}
                  fullWidth
                />
                <ColorInput
                  name="palettePrimaryLight"
                  label={formatMessage(
                    'userInterfacePage.primaryLightColorFieldLabel',
                  )}
                  fullWidth
                />
                <TextField
                  name="logoSvgData"
                  label={formatMessage('userInterfacePage.svgDataFieldLabel')}
                  fullWidth
                  multiline
                  minRows={3}
                />

                <Typography variant="h6">
                  {formatMessage('userInterfacePage.footerTitle')}
                </Typography>
                <Switch
                  name="enableFooter"
                  label={formatMessage('userInterfacePage.enableFooterLabel')}
                />
                <TextField
                  name="footerLogoSvgData"
                  label={formatMessage(
                    'userInterfacePage.footerLogoSvgDataFieldLabel',
                  )}
                  fullWidth
                  multiline
                  minRows={2}
                />
                <TextField
                  name="footerCopyrightText"
                  label={formatMessage(
                    'userInterfacePage.footerCopyrightTextFieldLabel',
                  )}
                  fullWidth
                />
                <ColorInput
                  name="footerTextColor"
                  label={formatMessage('userInterfacePage.footerTextColorLabel')}
                  fullWidth
                />
                <ColorInput
                  name="footerBackgroundColor"
                  label={formatMessage(
                    'userInterfacePage.footerBackgroundColorLabel',
                  )}
                  fullWidth
                />
                <TextField
                  name="footerDocsUrl"
                  label={formatMessage('userInterfacePage.footerDocsUrlLabel')}
                  fullWidth
                />
                <TextField
                  name="footerTosUrl"
                  label={formatMessage('userInterfacePage.footerTosUrlLabel')}
                  fullWidth
                />
                <TextField
                  name="footerPrivacyPolicyUrl"
                  label={formatMessage(
                    'userInterfacePage.footerPrivacyPolicyUrlLabel',
                  )}
                  fullWidth
                />
                <TextField
                  name="footerImprintUrl"
                  label={formatMessage(
                    'userInterfacePage.footerImprintUrlLabel',
                  )}
                  fullWidth
                />

                {success && (
                  <Alert severity="success">
                    {formatMessage('userInterfacePage.successfullyUpdated')}
                  </Alert>
                )}

                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isPending}
                >
                  {formatMessage('userInterfacePage.submit')}
                </LoadingButton>
              </Stack>
            )}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
