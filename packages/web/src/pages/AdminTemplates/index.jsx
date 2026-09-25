import * as React from 'react';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';

import Container from 'components/Container';
import Form from 'components/Form';
import NoResultFound from 'components/NoResultFound';
import PageTitle from 'components/PageTitle';
import SearchInput from 'components/SearchInput';
import Switch from 'components/Switch';
import TemplateItem from 'components/TemplatesDialog/TemplateItem';
import * as URLS from 'config/urls';
import useAdminTemplates from 'hooks/useAdminTemplates';
import useAdminUpdateConfig from 'hooks/useAdminUpdateConfig';
import useAutomatischConfig from 'hooks/useAutomatischConfig';
import useFormatMessage from 'hooks/useFormatMessage';

export default function AdminTemplates() {
  const formatMessage = useFormatMessage();
  const [templateName, setTemplateName] = React.useState('');
  const { data, isLoading } = useAdminTemplates();
  const templates = (data?.data || []).filter((template) =>
    template.name?.toLowerCase().includes(templateName.toLowerCase()),
  );
  const { data: configData, isLoading: isConfigLoading } =
    useAutomatischConfig();
  const { mutateAsync: updateConfig, isPending: isUpdateConfigPending } =
    useAdminUpdateConfig();

  const handleEnableTemplatesChange = async (event) => {
    await updateConfig({ enableTemplates: event.target.checked });
  };

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid container sx={{ mb: [0, 3] }} columnSpacing={1.5} rowSpacing={3}>
          <Grid container item xs sm alignItems="center" order={{ xs: 0 }}>
            <PageTitle>{formatMessage('adminTemplatesPage.title')}</PageTitle>
          </Grid>
          <Grid item xs={12} sm="auto" order={{ xs: 2, sm: 1 }}>
            <SearchInput onChange={(event) => setTemplateName(event.target.value)} />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ mt: [2, 0], mb: 2 }} />
        </Grid>

        {!isConfigLoading && (
          <Grid item xs={12} sx={{ mb: 3 }}>
            <Form
              defaultValues={{
                enableTemplates: !!configData?.data?.enableTemplates,
              }}
              noValidate
              automaticValidation={false}
              render={() => (
                <Switch
                  name="enableTemplates"
                  disabled={isUpdateConfigPending}
                  onChange={handleEnableTemplatesChange}
                  label={formatMessage('authenticationForm.active')}
                />
              )}
            />
          </Grid>
        )}

        {isLoading && (
          <CircularProgress
            data-test="templates-loader"
            sx={{ display: 'block', margin: '20px auto' }}
          />
        )}

        <Grid item xs={12}>
          {!isLoading &&
            templates.map((template) => (
              <TemplateItem
                key={template.id}
                template={template}
                to={URLS.ADMIN_UPDATE_TEMPLATE(template.id)}
              />
            ))}

          {!isLoading && !templates.length && (
            <NoResultFound
              text={formatMessage('adminTemplatesPage.noResult')}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
