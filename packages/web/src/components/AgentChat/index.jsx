import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
  Paper,
} from '@mui/material';

import useFormatMessage from 'hooks/useFormatMessage';
import useTestAgent from 'hooks/useTestAgent';

export default function AgentChat({ agentId }) {
  const formatMessage = useFormatMessage();
  const [prompt, setPrompt] = React.useState('');
  const [messages, setMessages] = React.useState([]);
  const { mutateAsync: testAgent, isPending } = useTestAgent(agentId);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMessage = prompt.trim();
    setPrompt('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);

    try {
      const response = await testAgent({ prompt: userMessage });
      const output =
        response?.data?.output ||
        response?.data?.message ||
        JSON.stringify(response?.data || response);
      setMessages((prev) => [...prev, { role: 'agent', text: output }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'agent', text: formatMessage('agent.chat.error') },
      ]);
    }
  };

  return (
    <Stack gap={2}>
      <Typography variant="h6">{formatMessage('agent.chat.title')}</Typography>
      <Typography variant="body2" color="text.secondary">
        {formatMessage('agent.chat.welcome')}
      </Typography>

      <Paper variant="outlined" sx={{ p: 2, minHeight: 200 }}>
        <Stack gap={1}>
          {messages.map((message, index) => (
            <Box key={index}>
              <Typography variant="caption" color="text.secondary">
                {message.role === 'user' ? 'You' : 'Agent'}
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {message.text}
              </Typography>
            </Box>
          ))}
          {isPending && (
            <Stack direction="row" gap={1} alignItems="center">
              <CircularProgress size={16} />
              <Typography variant="body2">
                {formatMessage('agent.chat.thinking')}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Paper>

      <Stack direction="row" gap={1}>
        <TextField
          fullWidth
          size="small"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={formatMessage('agent.chat.placeholder')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button variant="contained" onClick={handleSend} disabled={isPending}>
          Send
        </Button>
      </Stack>
    </Stack>
  );
}

AgentChat.propTypes = {
  agentId: PropTypes.string.isRequired,
};
