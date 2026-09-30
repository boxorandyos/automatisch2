import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import useFormatMessage from 'hooks/useFormatMessage';
import useMcpToolExecutions from 'hooks/useMcpToolExecutions';

export default function McpServerExecutions({ mcpServerId }) {
  const formatMessage = useFormatMessage();
  const { data, isLoading } = useMcpToolExecutions(mcpServerId);
  const executions = data?.data || [];

  if (isLoading) {
    return <CircularProgress sx={{ display: 'block', m: '20px auto' }} />;
  }

  if (!executions.length) {
    return (
      <Typography color="text.secondary">
        {formatMessage('mcpServerExecutions.noExecutions')}
      </Typography>
    );
  }

  return (
    <>
      {executions.map((execution) => (
        <Accordion key={execution.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {formatMessage('mcpServerExecutions.execution')}: {execution.id}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2">
              {formatMessage('mcpServerExecutions.inputData')}
            </Typography>
            <Typography
              component="pre"
              sx={{ whiteSpace: 'pre-wrap', fontSize: 12 }}
            >
              {JSON.stringify(execution.dataIn || execution.input, null, 2)}
            </Typography>
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              {formatMessage('mcpServerExecutions.outputData')}
            </Typography>
            <Typography
              component="pre"
              sx={{ whiteSpace: 'pre-wrap', fontSize: 12 }}
            >
              {JSON.stringify(execution.dataOut || execution.output, null, 2)}
            </Typography>
            {execution.errorDetails && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 1 }}>
                  {formatMessage('mcpServerExecutions.errorDetails')}
                </Typography>
                <Typography
                  component="pre"
                  sx={{ whiteSpace: 'pre-wrap', fontSize: 12 }}
                >
                  {JSON.stringify(execution.errorDetails, null, 2)}
                </Typography>
              </>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}

McpServerExecutions.propTypes = {
  mcpServerId: PropTypes.string.isRequired,
};
