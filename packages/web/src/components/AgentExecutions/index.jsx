import * as React from 'react';
import PropTypes from 'prop-types';
import {
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';

import * as URLS from 'config/urls';
import useAgentExecutions from 'hooks/useAgentExecutions';
import useFormatMessage from 'hooks/useFormatMessage';

export default function AgentExecutions({ agentId }) {
  const formatMessage = useFormatMessage();
  const { data, isLoading } = useAgentExecutions(agentId);
  const executions = data?.data || [];

  if (isLoading) {
    return <CircularProgress sx={{ display: 'block', m: '20px auto' }} />;
  }

  if (!executions.length) {
    return (
      <Typography color="text.secondary">
        {formatMessage('agentExecutions.noExecutions')}
      </Typography>
    );
  }

  return (
    <List>
      {executions.map((execution) => {
        const createdAt = DateTime.fromMillis(parseInt(execution.createdAt, 10));
        return (
          <ListItemButton
            key={execution.id}
            component={Link}
            to={URLS.AGENT_EXECUTION(agentId, execution.id)}
          >
            <ListItemText
              primary={execution.prompt || execution.id}
              secondary={
                createdAt.isValid
                  ? formatMessage('agentExecution.createdAt', {
                      datetime: createdAt.toLocaleString(DateTime.DATETIME_MED),
                    })
                  : execution.status
              }
            />
          </ListItemButton>
        );
      })}
    </List>
  );
}

AgentExecutions.propTypes = {
  agentId: PropTypes.string.isRequired,
};
