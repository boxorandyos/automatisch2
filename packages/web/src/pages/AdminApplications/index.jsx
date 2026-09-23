import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';

import AppRow from 'components/AppRow';
import Container from 'components/Container';
import NoResultFound from 'components/NoResultFound';
import PageTitle from 'components/PageTitle';
import SearchInput from 'components/SearchInput';
import * as URLS from 'config/urls';
import useApps from 'hooks/useApps';
import useFormatMessage from 'hooks/useFormatMessage';

export default function AdminApplications() {
  const formatMessage = useFormatMessage();
  const [appName, setAppName] = React.useState('');
  const { data, isLoading } = useApps({ name: appName });
  const apps = data?.data || [];

  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Grid container sx={{ mb: [0, 3] }} columnSpacing={1.5} rowSpacing={3}>
          <Grid container item xs sm alignItems="center">
            <PageTitle>{formatMessage('adminApps.title')}</PageTitle>
          </Grid>
          <Grid item xs={12} sm="auto">
            <SearchInput onChange={(e) => setAppName(e.target.value)} />
          </Grid>
        </Grid>
        <Divider sx={{ mt: [2, 0], mb: 2 }} />

        {isLoading && (
          <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
        )}

        {!isLoading && !apps.length && (
          <NoResultFound text={formatMessage('apps.noConnections')} />
        )}

        {!isLoading &&
          apps.map((app) => (
            <AppRow
              key={app.key}
              application={app}
              url={URLS.ADMIN_APP(app.key)}
            />
          ))}
      </Container>
    </Box>
  );
}
