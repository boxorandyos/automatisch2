import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import CardActionArea from '@mui/material/CardActionArea';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import AgentContextMenu from 'components/AgentContextMenu';
import useFormatMessage from 'hooks/useFormatMessage';
import * as URLS from 'config/urls';

export default function AgentRow({ agent }) {
  const formatMessage = useFormatMessage();
  const contextButtonRef = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <>
      <Card sx={{ mb: 1 }} data-test="agent-row">
        <CardActionArea component={Link} to={URLS.AGENT(agent.id)}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 1.5,
            }}
          >
            <Stack spacing={0.5} sx={{ minWidth: 0 }}>
              <Typography variant="h6" noWrap>
                {agent.name || formatMessage('agent.untitled')}
              </Typography>
              {agent.description && (
                <Typography variant="caption" noWrap>
                  {agent.description}
                </Typography>
              )}
            </Stack>

            <IconButton
              size="large"
              color="inherit"
              ref={contextButtonRef}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setAnchorEl(contextButtonRef.current);
              }}
            >
              <MoreHorizIcon />
            </IconButton>
          </Box>
        </CardActionArea>
      </Card>

      {anchorEl && (
        <AgentContextMenu
          agentId={agent.id}
          onClose={() => setAnchorEl(null)}
          anchorEl={anchorEl}
        />
      )}
    </>
  );
}

AgentRow.propTypes = {
  agent: PropTypes.object.isRequired,
};
