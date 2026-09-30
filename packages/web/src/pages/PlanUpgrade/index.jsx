import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import * as React from 'react';

import Container from 'components/Container';
import PageTitle from 'components/PageTitle';
import useCloud from 'hooks/useCloud';
import useFormatMessage from 'hooks/useFormatMessage';
import usePaymentPlans from 'hooks/usePaymentPlans';

export default function PlanUpgrade() {
  const formatMessage = useFormatMessage();
  useCloud({ redirect: true });
  const { data, isLoading, isError } = usePaymentPlans();
  const plans = data?.data || [];

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle>
            {formatMessage('usageDataInformation.upgradePlan')}
          </PageTitle>
        </Grid>
        <Grid item xs={12}>
          {isLoading && (
            <CircularProgress sx={{ display: 'block', m: '20px auto' }} />
          )}
          {isError && (
            <Typography color="text.secondary">
              Payment plans are unavailable.
            </Typography>
          )}
          <Stack gap={2}>
            {plans.map((plan) => (
              <Card key={plan.id || plan.name} variant="outlined">
                <CardContent>
                  <Typography variant="h6">{plan.name}</Typography>
                  {plan.price && (
                    <Typography color="text.secondary">{plan.price}</Typography>
                  )}
                  {plan.description && (
                    <Typography variant="body2">{plan.description}</Typography>
                  )}
                </CardContent>
              </Card>
            ))}
            {!isLoading && !isError && plans.length > 0 && (
              <Typography color="text.secondary" variant="body2">
                Online checkout is not configured in this build. Contact your
                administrator to change plans.
              </Typography>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
