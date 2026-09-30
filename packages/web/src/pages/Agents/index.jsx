import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import * as React from 'react';

import AgentRow from 'components/AgentRow';
import AgentsButtons from 'components/AgentsButtons';
import Container from 'components/Container';
import NoResultFound from 'components/NoResultFound';
import PageTitle from 'components/PageTitle';
import useAgents from 'hooks/useAgents';
import useFormatMessage from 'hooks/useFormatMessage';

export default function Agents() {
  const formatMessage = useFormatMessage();
  const { data, isLoading } = useAgents();
  const agents = data?.data || [];

  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Grid container sx={{ mb: [0, 3] }} columnSpacing={1.5} rowSpacing={3}>
          <Grid container item xs sm alignItems="center">
            <PageTitle>{formatMessage('agentsPage.title')}</PageTitle>
          </Grid>
          <Grid container item xs="auto" alignItems="center">
            <AgentsButtons />
          </Grid>
        </Grid>

        <Divider sx={{ mt: [2, 0], mb: 2 }} />

        {isLoading && (
          <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
        )}

        {!isLoading && !agents.length && (
          <NoResultFound text={formatMessage('agentsPage.noAgents')} />
        )}

        {!isLoading &&
          agents.map((agent) => <AgentRow key={agent.id} agent={agent} />)}
      </Container>
    </Box>
  );
}
