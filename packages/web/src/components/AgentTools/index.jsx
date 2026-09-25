import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

import ConfirmationDialog from 'components/ConfirmationDialog';
import * as URLS from 'config/urls';
import useAgentTools from 'hooks/useAgentTools';
import useDeleteAgentTool from 'hooks/useDeleteAgentTool';
import useFormatMessage from 'hooks/useFormatMessage';

export default function AgentTools({ agentId }) {
  const formatMessage = useFormatMessage();
  const { data, isLoading } = useAgentTools(agentId);
  const { mutateAsync: deleteTool } = useDeleteAgentTool(agentId);
  const tools = data?.data || [];
  const [toolToDelete, setToolToDelete] = React.useState(null);

  const confirmDelete = async () => {
    await deleteTool(toolToDelete);
    setToolToDelete(null);
  };

  if (isLoading) {
    return <CircularProgress sx={{ display: 'block', m: '20px auto' }} />;
  }

  return (
    <Box>
      <Stack direction="row" gap={1} mb={2}>
        <Button
          variant="outlined"
          component={Link}
          to={URLS.AGENT_ADD_ACTION(agentId)}
        >
          {formatMessage('agent.addAction')}
        </Button>
        <Button
          variant="outlined"
          component={Link}
          to={URLS.AGENT_ADD_FLOW(agentId)}
        >
          {formatMessage('agent.addFlow')}
        </Button>
      </Stack>

      {!tools.length && (
        <Typography color="text.secondary">
          {formatMessage('agent.noTools')}
        </Typography>
      )}

      <List>
        {tools.map((tool) => (
          <ListItem
            key={tool.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => setToolToDelete(tool.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={tool.appKey || tool.type}
              secondary={
                tool.type === 'flow'
                  ? `Flow: ${tool.flowId}`
                  : (tool.actions || []).join(', ')
              }
            />
          </ListItem>
        ))}
      </List>

      <ConfirmationDialog
        open={!!toolToDelete}
        onClose={() => setToolToDelete(null)}
        onConfirm={confirmDelete}
        title={formatMessage('agentTools.deleteDialogTitle')}
        description={formatMessage('agentTools.deleteDialogDescription')}
        cancelButtonChildren={formatMessage('agentTools.deleteDialogCancel')}
        confirmButtonChildren={formatMessage('agentTools.deleteDialogConfirm')}
      />
    </Box>
  );
}

AgentTools.propTypes = {
  agentId: PropTypes.string.isRequired,
};
