import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useFormatMessage from 'hooks/useFormatMessage';
import useMcpServer from 'hooks/useMcpServer';
import useRotateMcpServerToken from 'hooks/useRotateMcpServerToken';
import appConfig from 'config/app.js';

export default function McpServerConnect({ mcpServerId }) {
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
  const { data, isLoading } = useMcpServer(mcpServerId);
  const { mutateAsync: rotateToken, isPending } =
    useRotateMcpServerToken(mcpServerId);
  const [showToken, setShowToken] = React.useState(false);

  const mcpServer = data?.data;
  const serverUrl = mcpServer
    ? `${appConfig.baseUrl || window.location.origin}/api/v1/mcp/${mcpServer.token}`
    : '';

  if (isLoading) {
    return <CircularProgress sx={{ display: 'block', m: '20px auto' }} />;
  }

  if (!mcpServer) {
    return null;
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(serverUrl);
    enqueueSnackbar(formatMessage('mcpServerConnect.urlCopied'), {
      variant: 'success',
    });
  };

  const handleRotate = async () => {
    try {
      await rotateToken();
      enqueueSnackbar(formatMessage('mcpServerConnect.tokenRotateSuccess'), {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar(formatMessage('mcpServerConnect.rotateTokenError'), {
        variant: 'error',
      });
    }
  };

  return (
    <Stack gap={2}>
      <Typography variant="h6">
        {formatMessage('mcpServerConnect.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {formatMessage('mcpServerConnect.description')}
      </Typography>

      <TextField
        label={formatMessage('mcpServerConnect.serverUrl')}
        value={
          showToken
            ? serverUrl
            : serverUrl.replace(mcpServer.token, '•'.repeat(12))
        }
        fullWidth
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowToken((v) => !v)}>
                {showToken ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
              <IconButton onClick={handleCopy}>
                <ContentCopyIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          {formatMessage('mcpServerConnect.tokenManagement')}
        </Typography>
        <Button variant="outlined" onClick={handleRotate} disabled={isPending}>
          {isPending
            ? formatMessage('mcpServerConnect.rotatingToken')
            : formatMessage('mcpServerConnect.rotateToken')}
        </Button>
      </Box>
    </Stack>
  );
}

McpServerConnect.propTypes = {
  mcpServerId: PropTypes.string.isRequired,
};
