import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import mergeWith from 'lodash/mergeWith';
import * as React from 'react';

import ColorInput from 'components/ColorInput';
import Container from 'components/Container';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import Switch from 'components/Switch';
import TextField from 'components/TextField';
import useAdminUpdateConfig from 'hooks/useAdminUpdateConfig';
import useAutomatischConfig from 'hooks/useAutomatischConfig';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useFormatMessage from 'hooks/useFormatMessage';
import {
  primaryDarkColor,
  primaryLightColor,
  primaryMainColor,
} from 'styles/theme';

const getPrimaryMainColor = (color) => color || primaryMainColor;
const getPrimaryDarkColor = (color) => color || primaryDarkColor;
const getPrimaryLightColor = (color) => color || primaryLightColor;

const defaultValues = {
  title: 'Automatisch',
  palettePrimaryMain: primaryMainColor,
  palettePrimaryDark: primaryDarkColor,
  palettePrimaryLight: primaryLightColor,
  logoSvgData: '',
  enableFooter: false,
  footerLogoSvgData: '',
  footerCopyrightText: '',
  footerBackgroundColor: '#FFFFFF',
  footerTextColor: '#000000',
  footerDocsUrl: '',
  footerTosUrl: '',
  footerPrivacyPolicyUrl: '',
  footerImprintUrl: '',
};

const mergeIfGiven = (oldValue, newValue) => {
  if (newValue) {
    return newValue;
  }

  return oldValue;
};

export default function UserInterface() {
  const formatMessage = useFormatMessage();
  const { data, isLoading } = useAutomatischConfig();
  const config = data?.data || {};
  const { mutateAsync: updateConfig, isPending } = useAdminUpdateConfig();
  const enqueueSnackbar = useEnqueueSnackbar();
  const configWithDefaults = mergeWith(defaultValues, config, mergeIfGiven);

  const handleSubmit = async (uiData) => {
    try {
      await updateConfig({
        enableFooter: uiData.enableFooter,
        footerBackgroundColor: uiData.footerBackgroundColor,
        footerCopyrightText: uiData.footerCopyrightText,
        footerDocsUrl: uiData.footerDocsUrl,
        footerImprintUrl: uiData.footerImprintUrl,
        footerLogoSvgData: uiData.footerLogoSvgData,
        footerPrivacyPolicyUrl: uiData.footerPrivacyPolicyUrl,
        footerTextColor: uiData.footerTextColor,
        footerTosUrl: uiData.footerTosUrl,
        logoSvgData: uiData.logoSvgData,
        palettePrimaryDark: getPrimaryDarkColor(uiData.palettePrimaryDark),
        palettePrimaryLight: getPrimaryLightColor(uiData.palettePrimaryLight),
        palettePrimaryMain: getPrimaryMainColor(uiData.palettePrimaryMain),
        title: uiData.title,
      });

      enqueueSnackbar(formatMessage('userInterfacePage.successfullyUpdated'), {
        variant: 'success',
        SnackbarProps: {
          'data-test': 'snackbar-update-user-interface-success',
        },
      });
    } catch (error) {
      const errors = error?.response?.data?.errors;
      throw errors || error;
    }
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
            defaultValues={configWithDefaults}
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
                  data-test="primary-main-color-input"
                />
                <ColorInput
                  name="palettePrimaryDark"
                  label={formatMessage(
                    'userInterfacePage.primaryDarkColorFieldLabel',
                  )}
                  fullWidth
                  data-test="primary-dark-color-input"
                />
                <ColorInput
                  name="palettePrimaryLight"
                  label={formatMessage(
                    'userInterfacePage.primaryLightColorFieldLabel',
                  )}
                  fullWidth
                  data-test="primary-light-color-input"
                />
                <TextField
                  name="logoSvgData"
                  label={formatMessage('userInterfacePage.svgDataFieldLabel')}
                  fullWidth
                  multiline
                  minRows={3}
                  data-test="logo-svg-data-text-field"
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
                  data-test="footer-logo-svg-data-text-field"
                />
                <TextField
                  name="footerCopyrightText"
                  label={formatMessage(
                    'userInterfacePage.footerCopyrightTextFieldLabel',
                  )}
                  fullWidth
                  data-test="footer-copyright-text-field"
                />
                <ColorInput
                  name="footerBackgroundColor"
                  label={formatMessage(
                    'userInterfacePage.footerBackgroundColorLabel',
                  )}
                  fullWidth
                  data-test="footer-background-color-input"
                />
                <ColorInput
                  name="footerTextColor"
                  label={formatMessage('userInterfacePage.footerTextColorLabel')}
                  fullWidth
                  data-test="footer-text-color-input"
                />
                <TextField
                  name="footerDocsUrl"
                  label={formatMessage('userInterfacePage.footerDocsUrlLabel')}
                  fullWidth
                  data-test="logo-docs-text-field"
                />
                <TextField
                  name="footerTosUrl"
                  label={formatMessage('userInterfacePage.footerTosUrlLabel')}
                  fullWidth
                  data-test="logo-tos-url-text-field"
                />
                <TextField
                  name="footerPrivacyPolicyUrl"
                  label={formatMessage(
                    'userInterfacePage.footerPrivacyPolicyUrlLabel',
                  )}
                  fullWidth
                  data-test="logo-privacy-policy-url-text-field"
                />
                <TextField
                  name="footerImprintUrl"
                  label={formatMessage(
                    'userInterfacePage.footerImprintUrlLabel',
                  )}
                  fullWidth
                  data-test="logo-imprint-url-text-field"
                />

                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isPending}
                  data-test="update-button"
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
