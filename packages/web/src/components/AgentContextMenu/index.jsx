import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import * as React from 'react';
import { Link } from 'react-router-dom';

import * as URLS from 'config/urls';
import useDeleteAgent from 'hooks/useDeleteAgent';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useFormatMessage from 'hooks/useFormatMessage';

export default function AgentContextMenu({ agentId, onClose, anchorEl }) {
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
  const { mutateAsync: deleteAgent } = useDeleteAgent(agentId);

  const onDelete = React.useCallback(async () => {
    await deleteAgent();
    enqueueSnackbar(formatMessage('agentContextMenu.successfullyDeleted'), {
      variant: 'success',
    });
    onClose();
  }, [deleteAgent, enqueueSnackbar, formatMessage, onClose]);

  return (
    <Menu open={true} onClose={onClose} anchorEl={anchorEl}>
      <MenuItem component={Link} to={URLS.AGENT(agentId)} onClick={onClose}>
        {formatMessage('agent.settings')}
      </MenuItem>
      <MenuItem onClick={onDelete}>{formatMessage('agent.delete')}</MenuItem>
    </Menu>
  );
}

AgentContextMenu.propTypes = {
  agentId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  anchorEl: PropTypes.any,
};
