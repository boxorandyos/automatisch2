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
import useDeleteMcpTool from 'hooks/useDeleteMcpTool';
import useFormatMessage from 'hooks/useFormatMessage';
import useMcpTools from 'hooks/useMcpTools';

export default function McpServerTools({ mcpServerId }) {
  const formatMessage = useFormatMessage();
  const { data, isLoading } = useMcpTools(mcpServerId);
  const { mutateAsync: deleteTool } = useDeleteMcpTool(mcpServerId);
  const tools = data?.data || [];
  const [toolToDelete, setToolToDelete] = React.useState(null);

  if (isLoading) {
    return <CircularProgress sx={{ display: 'block', m: '20px auto' }} />;
  }

  return (
    <Box>
      <Stack direction="row" gap={1} mb={2}>
        <Button
          variant="outlined"
          component={Link}
          to={URLS.MCP_SERVER_ADD_ACTION(mcpServerId)}
        >
          {formatMessage('mcpServer.addAction')}
        </Button>
        <Button
          variant="outlined"
          component={Link}
          to={URLS.MCP_SERVER_ADD_FLOW(mcpServerId)}
        >
          {formatMessage('mcpServer.addFlow')}
        </Button>
      </Stack>

      {!tools.length && (
        <Typography color="text.secondary">
          {formatMessage('mcpServerTools.noTools')}
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
              primary={tool.appKey || tool.action || tool.type}
              secondary={
                tool.type === 'flow'
                  ? `Flow: ${tool.flowId}`
                  : tool.action
              }
            />
          </ListItem>
        ))}
      </List>

      <ConfirmationDialog
        open={!!toolToDelete}
        onClose={() => setToolToDelete(null)}
        onConfirm={async () => {
          await deleteTool(toolToDelete);
          setToolToDelete(null);
        }}
        title={formatMessage('mcpTool.deleteConfirmation.title')}
        description={formatMessage('mcpTool.deleteConfirmation.description')}
        cancelButtonChildren={formatMessage(
          'mcpTool.deleteConfirmation.cancelText',
        )}
        confirmButtonChildren={formatMessage(
          'mcpTool.deleteConfirmation.confirmText',
        )}
      />
    </Box>
  );
}

McpServerTools.propTypes = {
  mcpServerId: PropTypes.string.isRequired,
};
