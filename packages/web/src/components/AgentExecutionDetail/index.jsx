import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';

import * as URLS from 'config/urls';
import useAgentExecution from 'hooks/useAgentExecution';
import useFormatMessage from 'hooks/useFormatMessage';

export default function AgentExecutionDetail({ agentId, executionId }) {
  const formatMessage = useFormatMessage();
  const { data, isLoading } = useAgentExecution(agentId, executionId);
  const execution = data?.data;

  if (isLoading) {
    return <CircularProgress sx={{ display: 'block', m: '20px auto' }} />;
  }

  if (!execution) {
    return null;
  }

  const finishedAt = execution.finishedAt
    ? DateTime.fromMillis(parseInt(execution.finishedAt, 10))
    : null;

  return (
    <Stack gap={2}>
      <Button
        component={Link}
        to={URLS.AGENT_EXECUTIONS(agentId)}
        sx={{ alignSelf: 'flex-start' }}
      >
        {formatMessage('agentExecution.backToExecutions')}
      </Button>

      <Typography variant="subtitle2">
        {formatMessage('agentExecution.status')}: {execution.status}
      </Typography>

      {finishedAt?.isValid && (
        <Typography variant="body2" color="text.secondary">
          {formatMessage('agentExecution.finishedAt', {
            datetime: finishedAt.toLocaleString(DateTime.DATETIME_MED),
          })}
        </Typography>
      )}

      <Box>
        <Typography variant="h6">{formatMessage('agentExecution.prompt')}</Typography>
        <Typography sx={{ whiteSpace: 'pre-wrap' }}>{execution.prompt}</Typography>
      </Box>

      <Box>
        <Typography variant="h6">{formatMessage('agentExecution.output')}</Typography>
        <Typography sx={{ whiteSpace: 'pre-wrap' }}>{execution.output}</Typography>
      </Box>
    </Stack>
  );
}

AgentExecutionDetail.propTypes = {
  agentId: PropTypes.string.isRequired,
  executionId: PropTypes.string.isRequired,
};
