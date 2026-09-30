import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import * as React from 'react';
import { Link } from 'react-router-dom';

import * as URLS from 'config/urls';
import useDeleteMcpServer from 'hooks/useDeleteMcpServer';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useFormatMessage from 'hooks/useFormatMessage';

export default function McpServerContextMenu({ mcpServerId, onClose, anchorEl }) {
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
  const { mutateAsync: deleteMcpServer } = useDeleteMcpServer(mcpServerId);

  const onDelete = React.useCallback(async () => {
    await deleteMcpServer();
    enqueueSnackbar(formatMessage('mcpServerContextMenu.successfullyDeleted'), {
      variant: 'success',
    });
    onClose();
  }, [deleteMcpServer, enqueueSnackbar, formatMessage, onClose]);

  return (
    <Menu open={true} onClose={onClose} anchorEl={anchorEl}>
      <MenuItem component={Link} to={URLS.MCP_SERVER(mcpServerId)} onClick={onClose}>
        Open
      </MenuItem>
      <MenuItem onClick={onDelete}>{formatMessage('mcpServer.delete')}</MenuItem>
    </Menu>
  );
}

McpServerContextMenu.propTypes = {
  mcpServerId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  anchorEl: PropTypes.any,
};
