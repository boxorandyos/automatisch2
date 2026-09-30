import * as React from 'react';
import {
  Link,
  Navigate,
  Route,
  Routes,
  useMatch,
  useParams,
} from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import AddMcpActionDialog from 'components/AddMcpActionDialog';
import AddMcpFlowDialog from 'components/AddMcpFlowDialog';
import Container from 'components/Container';
import EditableTypography from 'components/EditableTypography';
import McpServerConnect from 'components/McpServerConnect';
import McpServerExecutions from 'components/McpServerExecutions';
import McpServerTools from 'components/McpServerTools';
import PageTitle from 'components/PageTitle';
import * as URLS from 'config/urls';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useFormatMessage from 'hooks/useFormatMessage';
import useMcpServer from 'hooks/useMcpServer';
import useUpdateMcpServer from 'hooks/useUpdateMcpServer';

export default function McpServer() {
  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('md'));
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
  const { mcpServerId } = useParams();
  const { data, isLoading } = useMcpServer(mcpServerId);
  const mcpServer = data?.data;
  const { mutateAsync: updateServer } = useUpdateMcpServer(mcpServerId);

  const toolsMatch = useMatch({
    path: URLS.MCP_SERVER_TOOLS_PATTERN,
    end: false,
  });
  const connectMatch = useMatch({
    path: URLS.MCP_SERVER_CONNECT_PATTERN,
    end: false,
  });
  const executionsMatch = useMatch({
    path: URLS.MCP_SERVER_EXECUTIONS_PATTERN,
    end: false,
  });

  if (isLoading || !mcpServer) {
    return null;
  }

  const handleRename = async (name) => {
    try {
      await updateServer({ name });
      enqueueSnackbar(formatMessage('mcpServer.nameUpdated'), {
        variant: 'success',
      });
    } catch {
      enqueueSnackbar(formatMessage('mcpServer.nameUpdateError'), {
        variant: 'error',
      });
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Grid container sx={{ mb: 3 }} alignItems="center">
          <Grid item xs>
            <PageTitle>
              <EditableTypography onConfirm={handleRename}>
                {mcpServer.name || formatMessage('mcpServer.untitled')}
              </EditableTypography>
            </PageTitle>
          </Grid>
        </Grid>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs
            variant={matchSmallScreens ? 'fullWidth' : undefined}
            value={
              toolsMatch?.pattern?.path ||
              connectMatch?.pattern?.path ||
              executionsMatch?.pattern?.path ||
              URLS.MCP_SERVER_TOOLS_PATTERN
            }
          >
            <Tab
              label={formatMessage('mcpServer.tools')}
              to={URLS.MCP_SERVER_TOOLS(mcpServerId)}
              value={URLS.MCP_SERVER_TOOLS_PATTERN}
              component={Link}
            />
            <Tab
              label={formatMessage('mcpServer.connect')}
              to={URLS.MCP_SERVER_CONNECT(mcpServerId)}
              value={URLS.MCP_SERVER_CONNECT_PATTERN}
              component={Link}
            />
            <Tab
              label={formatMessage('mcpServer.executions')}
              to={URLS.MCP_SERVER_EXECUTIONS(mcpServerId)}
              value={URLS.MCP_SERVER_EXECUTIONS_PATTERN}
              component={Link}
            />
          </Tabs>
        </Box>

        <Routes>
          <Route
            path="tools"
            element={<McpServerTools mcpServerId={mcpServerId} />}
          />
          <Route
            path="tools/add-action"
            element={<AddMcpActionDialog mcpServerId={mcpServerId} />}
          />
          <Route
            path="tools/add-flow"
            element={<AddMcpFlowDialog mcpServerId={mcpServerId} />}
          />
          <Route
            path="connect"
            element={<McpServerConnect mcpServerId={mcpServerId} />}
          />
          <Route
            path="executions"
            element={<McpServerExecutions mcpServerId={mcpServerId} />}
          />
          <Route
            path="/"
            element={
              <Navigate to={URLS.MCP_SERVER_TOOLS(mcpServerId)} replace />
            }
          />
        </Routes>
      </Container>
    </Box>
  );
}
