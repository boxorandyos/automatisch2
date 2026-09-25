import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import Container from 'components/Container';
import Invoices from 'components/Invoices';
import PageTitle from 'components/PageTitle';
import UsageDataInformation from 'components/UsageDataInformation';
import useCloud from 'hooks/useCloud';
import useFormatMessage from 'hooks/useFormatMessage';

export default function BillingAndUsageSettings() {
  const formatMessage = useFormatMessage();
  useCloud({ redirect: true });

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle>
            {formatMessage('billingAndUsageSettings.title')}
          </PageTitle>
        </Grid>
        <Grid item xs={12}>
          <Stack gap={3}>
            <Typography variant="h6">
              {formatMessage('billingAndUsageSettings.paymentInformation')}
            </Typography>
            <UsageDataInformation />
            <Invoices />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
