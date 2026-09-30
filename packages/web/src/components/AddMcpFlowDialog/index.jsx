import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import * as URLS from 'config/urls';
import useCreateMcpTool from 'hooks/useCreateMcpTool';
import useFlows from 'hooks/useFlows';
import useFormatMessage from 'hooks/useFormatMessage';

export default function AddMcpFlowDialog({ mcpServerId }) {
  const formatMessage = useFormatMessage();
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');
  const [selectedFlowIds, setSelectedFlowIds] = React.useState([]);
  const { data, isLoading } = useFlows({
    flowName: search,
    status: 'published',
    page: 1,
  });
  const flows = data?.data || [];
  const { mutateAsync: createTool, isPending } = useCreateMcpTool(mcpServerId);

  const onClose = () => navigate(URLS.MCP_SERVER_TOOLS(mcpServerId));

  const toggleFlow = (flowId) => {
    setSelectedFlowIds((prev) =>
      prev.includes(flowId)
        ? prev.filter((id) => id !== flowId)
        : [...prev, flowId],
    );
  };

  const handleAdd = async () => {
    for (const flowId of selectedFlowIds) {
      await createTool({ type: 'flow', flowId });
    }
    onClose();
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{formatMessage('addMcpFlowDialog.title')}</DialogTitle>
      <DialogContent>
        <Stack gap={2} sx={{ mt: 1 }}>
          <TextField
            label={formatMessage('addMcpFlowDialog.searchFlow')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
          <Typography variant="body2">
            {formatMessage('addMcpFlowDialog.selectFlow')}
          </Typography>

          {!isLoading && !flows.length && (
            <Typography color="text.secondary">
              {search
                ? formatMessage('addMcpFlowDialog.noFlowsFound')
                : formatMessage('addMcpFlowDialog.noMcpFlows')}
            </Typography>
          )}

          {flows.map((flow) => (
            <Stack direction="row" alignItems="center" key={flow.id}>
              <Checkbox
                checked={selectedFlowIds.includes(flow.id)}
                onChange={() => toggleFlow(flow.id)}
              />
              <ListItemText primary={flow.name} />
            </Stack>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {formatMessage('addMcpFlowDialog.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={!selectedFlowIds.length || isPending}
        >
          {formatMessage('addMcpFlowDialog.add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddMcpFlowDialog.propTypes = {
  mcpServerId: PropTypes.string.isRequired,
};
