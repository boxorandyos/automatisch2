import * as React from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import TemplateItem from 'components/TemplatesDialog/TemplateItem';
import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import useTemplates from 'hooks/useTemplates';

export default function TemplatesDialog() {
  const formatMessage = useFormatMessage();
  const navigate = useNavigate();
  const { data, isLoading } = useTemplates();
  const templates = data?.data || [];

  const onClose = () => navigate(URLS.FLOWS);

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm" data-test="templates-dialog">
      <DialogTitle>{formatMessage('templatesDialog.title')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {formatMessage('templatesDialog.description')}
        </Typography>

        {isLoading && (
          <CircularProgress sx={{ display: 'block', m: '20px auto' }} />
        )}

        <List>
          {templates.map((template) => (
            <TemplateItem key={template.id} template={template} />
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {formatMessage('templatesDialog.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
