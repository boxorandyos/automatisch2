import * as React from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import Container from 'components/Container';
import PageTitle from 'components/PageTitle';
import useFormatMessage from 'hooks/useFormatMessage';
import SamlConfiguration from './SamlConfiguration';
import RoleMappings from './RoleMappings';

export default function Authentication() {
  const formatMessage = useFormatMessage();

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle>{formatMessage('authenticationPage.title')}</PageTitle>
        </Grid>
        <Grid item xs={12}>
          <Stack gap={4}>
            <SamlConfiguration />
            <Divider />
            <RoleMappings />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
