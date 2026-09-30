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

import McpServerContextMenu from 'components/McpServerContextMenu';
import useFormatMessage from 'hooks/useFormatMessage';
import * as URLS from 'config/urls';

export default function McpServerRow({ mcpServer }) {
  const formatMessage = useFormatMessage();
  const contextButtonRef = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <>
      <Card sx={{ mb: 1 }} data-test="mcp-server-row">
        <CardActionArea component={Link} to={URLS.MCP_SERVER(mcpServer.id)}>
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
                {mcpServer.name || formatMessage('mcpServer.untitled')}
              </Typography>
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
        <McpServerContextMenu
          mcpServerId={mcpServer.id}
          onClose={() => setAnchorEl(null)}
          anchorEl={anchorEl}
        />
      )}
    </>
  );
}

McpServerRow.propTypes = {
  mcpServer: PropTypes.object.isRequired,
};
