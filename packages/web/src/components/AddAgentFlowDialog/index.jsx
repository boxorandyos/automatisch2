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
import useCreateAgentTool from 'hooks/useCreateAgentTool';
import useFlows from 'hooks/useFlows';
import useFormatMessage from 'hooks/useFormatMessage';

export default function AddAgentFlowDialog({ agentId }) {
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
  const { mutateAsync: createTool, isPending } = useCreateAgentTool(agentId);

  const onClose = () => navigate(URLS.AGENT_TOOLS(agentId));

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
      <DialogTitle>{formatMessage('addAgentFlowDialog.title')}</DialogTitle>
      <DialogContent>
        <Stack gap={2} sx={{ mt: 1 }}>
          <TextField
            label={formatMessage('addAgentFlowDialog.searchFlow')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
          <Typography variant="body2">
            {formatMessage('addAgentFlowDialog.selectFlow')}
          </Typography>

          {!isLoading && !flows.length && (
            <Typography color="text.secondary">
              {search
                ? formatMessage('addAgentFlowDialog.noFlowsFound')
                : formatMessage('addAgentFlowDialog.noPublishedFlows')}
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
          {formatMessage('addAgentFlowDialog.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={!selectedFlowIds.length || isPending}
        >
          {formatMessage('addAgentFlowDialog.add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddAgentFlowDialog.propTypes = {
  agentId: PropTypes.string.isRequired,
};
