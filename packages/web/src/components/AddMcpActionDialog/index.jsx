import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import * as URLS from 'config/urls';
import useActions from 'hooks/useActions';
import useAppConnections from 'hooks/useAppConnections';
import useCreateMcpTool from 'hooks/useCreateMcpTool';
import useFormatMessage from 'hooks/useFormatMessage';
import useLazyApps from 'hooks/useLazyApps';

export default function AddMcpActionDialog({ mcpServerId }) {
  const formatMessage = useFormatMessage();
  const navigate = useNavigate();
  const [appName, setAppName] = React.useState('');
  const [selectedApp, setSelectedApp] = React.useState(null);
  const [selectedActions, setSelectedActions] = React.useState([]);
  const [connectionId, setConnectionId] = React.useState('');

  const { data: appsData, mutate, isPending: isAppsLoading } = useLazyApps({
    appName,
  });
  const apps = appsData?.data || [];
  const { data: actionsData } = useActions(selectedApp?.key);
  const actions = actionsData?.data || [];
  const { data: connectionsData } = useAppConnections(selectedApp?.key);
  const connections = connectionsData?.data || [];
  const { mutateAsync: createTool, isPending } = useCreateMcpTool(mcpServerId);

  React.useEffect(() => {
    mutate();
  }, [appName, mutate]);

  const onClose = () => navigate(URLS.MCP_SERVER_TOOLS(mcpServerId));

  const handleAdd = async () => {
    for (const action of selectedActions) {
      await createTool({
        type: 'app',
        appKey: selectedApp.key,
        connectionId,
        action,
      });
    }
    onClose();
  };

  const toggleAction = (key) => {
    setSelectedActions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{formatMessage('addMcpActionDialog.title')}</DialogTitle>
      <DialogContent>
        {!selectedApp && (
          <Stack gap={2} sx={{ mt: 1 }}>
            <TextField
              label={formatMessage('addMcpActionDialog.searchApp')}
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              fullWidth
            />
            <List>
              {apps.map((app) => (
                <ListItemButton key={app.key} onClick={() => setSelectedApp(app)}>
                  <ListItemText primary={app.name} />
                </ListItemButton>
              ))}
            </List>
          </Stack>
        )}

        {selectedApp && (
          <Stack gap={2} sx={{ mt: 1 }}>
            <Button onClick={() => setSelectedApp(null)}>
              {formatMessage('addMcpActionDialog.backToApps')}
            </Button>

            <FormControl fullWidth>
              <InputLabel>
                {formatMessage('addMcpActionDialog.selectConnection')}
              </InputLabel>
              <Select
                value={connectionId}
                label={formatMessage('addMcpActionDialog.selectConnection')}
                onChange={(e) => setConnectionId(e.target.value)}
              >
                {connections.map((connection) => (
                  <MenuItem key={connection.id} value={connection.id}>
                    {connection.formattedData?.screenName || connection.id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {actions.map((action) => (
              <Stack direction="row" alignItems="center" key={action.key}>
                <Checkbox
                  checked={selectedActions.includes(action.key)}
                  onChange={() => toggleAction(action.key)}
                />
                <ListItemText primary={action.name || action.key} />
              </Stack>
            ))}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {formatMessage('addMcpActionDialog.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={
            !selectedApp || !connectionId || !selectedActions.length || isPending
          }
        >
          {formatMessage('addMcpActionDialog.add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddMcpActionDialog.propTypes = {
  mcpServerId: PropTypes.string.isRequired,
};
