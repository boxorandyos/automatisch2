import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Link } from 'react-router-dom';

import Container from 'components/Container';
import Form from 'components/Form';
import NoResultFound from 'components/NoResultFound';
import PageTitle from 'components/PageTitle';
import SearchInput from 'components/SearchInput';
import Switch from 'components/Switch';
import * as URLS from 'config/urls';
import useAdminDeleteTemplate from 'hooks/useAdminDeleteTemplate';
import useAdminTemplates from 'hooks/useAdminTemplates';
import useAdminUpdateConfig from 'hooks/useAdminUpdateConfig';
import useAutomatischConfig from 'hooks/useAutomatischConfig';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useFormatMessage from 'hooks/useFormatMessage';

function TemplateContextMenu({ templateId, anchorEl, onClose }) {
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
  const { mutateAsync: deleteTemplate } = useAdminDeleteTemplate(templateId);

  const handleDelete = async () => {
    await deleteTemplate();
    enqueueSnackbar(
      formatMessage('adminTemplateContextMenu.successfullyDeleted'),
      { variant: 'success' },
    );
    onClose();
  };

  return (
    <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={onClose}>
      <MenuItem
        component={Link}
        to={URLS.ADMIN_UPDATE_TEMPLATE(templateId)}
        onClick={onClose}
      >
        Edit
      </MenuItem>
      <MenuItem onClick={handleDelete}>
        {formatMessage('adminTemplateContextMenu.delete')}
      </MenuItem>
    </Menu>
  );
}

TemplateContextMenu.propTypes = {
  templateId: PropTypes.string,
  anchorEl: PropTypes.any,
  onClose: PropTypes.func.isRequired,
};

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
  const [menuState, setMenuState] = React.useState({
    anchorEl: null,
    templateId: null,
  });

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
              <Card key={template.id} sx={{ mb: 1 }} data-test="template-row">
                <CardActionArea
                  component={Link}
                  to={URLS.ADMIN_UPDATE_TEMPLATE(template.id)}
                  data-test="card-action-area"
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 2,
                    }}
                  >
                    <Typography variant="h6" noWrap>
                      {template.name}
                    </Typography>
                    <Box>
                      <IconButton
                        size="large"
                        color="inherit"
                        aria-label="open context menu"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setMenuState({
                            anchorEl: event.currentTarget,
                            templateId: template.id,
                          });
                        }}
                      >
                        <MoreHorizIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}

          {!isLoading && !templates.length && (
            <NoResultFound
              text={formatMessage('adminTemplatesPage.noResult')}
            />
          )}
        </Grid>

        <TemplateContextMenu
          templateId={menuState.templateId}
          anchorEl={menuState.anchorEl}
          onClose={() => setMenuState({ anchorEl: null, templateId: null })}
        />
      </Grid>
    </Container>
  );
}
