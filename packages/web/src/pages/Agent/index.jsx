import * as React from 'react';
import PropTypes from 'prop-types';
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
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import AddAgentActionDialog from 'components/AddAgentActionDialog';
import AddAgentFlowDialog from 'components/AddAgentFlowDialog';
import AgentChat from 'components/AgentChat';
import AgentExecutionDetail from 'components/AgentExecutionDetail';
import AgentExecutions from 'components/AgentExecutions';
import AgentTools from 'components/AgentTools';
import Container from 'components/Container';
import EditableTypography from 'components/EditableTypography';
import PageTitle from 'components/PageTitle';
import * as URLS from 'config/urls';
import useAgent from 'hooks/useAgent';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useFormatMessage from 'hooks/useFormatMessage';
import useUpdateAgent from 'hooks/useUpdateAgent';

function AgentSettings({ agentId, agent }) {
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
  const { mutateAsync: updateAgent, isPending } = useUpdateAgent(agentId);
  const [description, setDescription] = React.useState(agent.description || '');
  const [instructions, setInstructions] = React.useState(
    agent.instructions || '',
  );

  React.useEffect(() => {
    setDescription(agent.description || '');
    setInstructions(agent.instructions || '');
  }, [agent]);

  const handleSave = async () => {
    try {
      await updateAgent({ description, instructions });
      enqueueSnackbar(formatMessage('agent.updated'), { variant: 'success' });
    } catch {
      enqueueSnackbar(formatMessage('agent.updateError'), { variant: 'error' });
    }
  };

  return (
    <Stack gap={2}>
      <TextField
        label={formatMessage('agent.description')}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        minRows={2}
        placeholder={formatMessage('agent.descriptionPlaceholder')}
      />
      <TextField
        label={formatMessage('agent.instructions')}
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        fullWidth
        multiline
        minRows={4}
        placeholder={formatMessage('agent.instructionsPlaceholder')}
      />
      <LoadingButton
        variant="contained"
        onClick={handleSave}
        loading={isPending}
        sx={{ alignSelf: 'flex-start' }}
      >
        {formatMessage('agent.save')}
      </LoadingButton>

      <AgentChat agentId={agentId} />
    </Stack>
  );
}

AgentSettings.propTypes = {
  agentId: PropTypes.string.isRequired,
  agent: PropTypes.object.isRequired,
};

export default function Agent() {

  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('md'));
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
  const { agentId } = useParams();
  const { data, isLoading } = useAgent(agentId);
  const agent = data?.data;
  const { mutateAsync: updateAgent } = useUpdateAgent(agentId);

  const toolsMatch = useMatch({ path: URLS.AGENT_TOOLS_PATTERN, end: false });
  const settingsMatch = useMatch({
    path: URLS.AGENT_SETTINGS_PATTERN,
    end: false,
  });
  const executionsMatch = useMatch({
    path: URLS.AGENT_EXECUTIONS_PATTERN,
    end: false,
  });

  if (isLoading || !agent) {
    return null;
  }

  const handleRename = async (name) => {
    try {
      await updateAgent({ name });
      enqueueSnackbar(formatMessage('agent.nameUpdated'), {
        variant: 'success',
      });
    } catch {
      enqueueSnackbar(formatMessage('agent.nameUpdateError'), {
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
                {agent.name || formatMessage('agent.untitled')}
              </EditableTypography>
            </PageTitle>
          </Grid>
        </Grid>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs
            variant={matchSmallScreens ? 'fullWidth' : undefined}
            value={
              toolsMatch?.pattern?.path ||
              settingsMatch?.pattern?.path ||
              executionsMatch?.pattern?.path ||
              URLS.AGENT_TOOLS_PATTERN
            }
          >
            <Tab
              label={formatMessage('agent.tools')}
              to={URLS.AGENT_TOOLS(agentId)}
              value={URLS.AGENT_TOOLS_PATTERN}
              component={Link}
            />
            <Tab
              label={formatMessage('agent.settings')}
              to={URLS.AGENT_SETTINGS(agentId)}
              value={URLS.AGENT_SETTINGS_PATTERN}
              component={Link}
            />
            <Tab
              label={formatMessage('agent.executions')}
              to={URLS.AGENT_EXECUTIONS(agentId)}
              value={URLS.AGENT_EXECUTIONS_PATTERN}
              component={Link}
            />
          </Tabs>
        </Box>

        <Routes>
          <Route path="tools" element={<AgentTools agentId={agentId} />} />
          <Route
            path="tools/add-action"
            element={<AddAgentActionDialog agentId={agentId} />}
          />
          <Route
            path="tools/add-flow"
            element={<AddAgentFlowDialog agentId={agentId} />}
          />
          <Route
            path="settings"
            element={<AgentSettings agentId={agentId} agent={agent} />}
          />
          <Route
            path="executions"
            element={<AgentExecutions agentId={agentId} />}
          />
          <Route
            path="executions/:executionId"
            element={
              <AgentExecutionDetailWrapper agentId={agentId} />
            }
          />
          <Route
            path="/"
            element={<Navigate to={URLS.AGENT_TOOLS(agentId)} replace />}
          />
        </Routes>
      </Container>
    </Box>
  );
}

function AgentExecutionDetailWrapper({ agentId }) {
  const { executionId } = useParams();
  return <AgentExecutionDetail agentId={agentId} executionId={executionId} />;
}

AgentExecutionDetailWrapper.propTypes = {
  agentId: PropTypes.string.isRequired,
};
