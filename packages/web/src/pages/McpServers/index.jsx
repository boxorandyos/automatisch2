import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import Container from 'components/Container';
import McpServerRow from 'components/McpServerRow';
import NoResultFound from 'components/NoResultFound';
import PageTitle from 'components/PageTitle';
import * as URLS from 'config/urls';
import useCreateMcpServer from 'hooks/useCreateMcpServer';
import useFormatMessage from 'hooks/useFormatMessage';
import useMcpServers from 'hooks/useMcpServers';

export default function McpServers() {
  const formatMessage = useFormatMessage();
  const navigate = useNavigate();
  const { data, isLoading } = useMcpServers();
  const servers = data?.data || [];
  const { mutateAsync: createServer, isPending } = useCreateMcpServer();

  const handleCreate = async () => {
    const response = await createServer({ name: 'MCP Server' });
    const id = response?.data?.id;
    if (id) {
      navigate(URLS.MCP_SERVER(id));
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Grid container sx={{ mb: [0, 3] }} columnSpacing={1.5} rowSpacing={3}>
          <Grid container item xs sm alignItems="center">
            <PageTitle>{formatMessage('mcpServersPage.title')}</PageTitle>
          </Grid>
          <Grid container item xs="auto" alignItems="center">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              disabled={isPending}
            >
              {formatMessage('mcpServersPage.createMcpServer')}
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ mt: [2, 0], mb: 2 }} />

        {isLoading && (
          <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
        )}

        {!isLoading && !servers.length && (
          <NoResultFound text={formatMessage('mcpServersPage.noMcpServers')} />
        )}

        {!isLoading &&
          servers.map((server) => (
            <McpServerRow key={server.id} mcpServer={server} />
          ))}
      </Container>
    </Box>
  );
}
