import * as React from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';

import Container from 'components/Container';
import NoResultFound from 'components/NoResultFound';
import PageTitle from 'components/PageTitle';
import * as URLS from 'config/urls';
import useAdminDeleteTemplate from 'hooks/useAdminDeleteTemplate';
import useAdminTemplates from 'hooks/useAdminTemplates';
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
      <MenuItem component={Link} to={URLS.ADMIN_UPDATE_TEMPLATE(templateId)} onClick={onClose}>
        Edit
      </MenuItem>
      <MenuItem onClick={handleDelete}>
        {formatMessage('adminTemplateContextMenu.delete')}
      </MenuItem>
    </Menu>
  );
}

export default function AdminTemplates() {
  const formatMessage = useFormatMessage();
  const { data, isLoading } = useAdminTemplates();
  const templates = data?.data || [];
  const [menuState, setMenuState] = React.useState({
    anchorEl: null,
    templateId: null,
  });

  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <PageTitle sx={{ mb: 3 }}>
          {formatMessage('adminTemplatesPage.title')}
        </PageTitle>

        {isLoading && (
          <CircularProgress sx={{ display: 'block', m: '20px auto' }} />
        )}

        {!isLoading && !templates.length && (
          <NoResultFound text={formatMessage('adminTemplatesPage.noResult')} />
        )}

        <List>
          {templates.map((template) => (
            <ListItem
              key={template.id}
              secondaryAction={
                <IconButton
                  onClick={(e) =>
                    setMenuState({
                      anchorEl: e.currentTarget,
                      templateId: template.id,
                    })
                  }
                >
                  <MoreHorizIcon />
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton
                component={Link}
                to={URLS.ADMIN_UPDATE_TEMPLATE(template.id)}
              >
                <ListItemText primary={template.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <TemplateContextMenu
          templateId={menuState.templateId}
          anchorEl={menuState.anchorEl}
          onClose={() => setMenuState({ anchorEl: null, templateId: null })}
        />
      </Container>
    </Box>
  );
}
