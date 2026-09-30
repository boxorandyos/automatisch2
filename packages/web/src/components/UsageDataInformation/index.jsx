import * as React from 'react';
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Button,
  Skeleton,
} from '@mui/material';
import { Link } from 'react-router-dom';

import * as URLS from 'config/urls';
import useCurrentUser from 'hooks/useCurrentUser';
import useFormatMessage from 'hooks/useFormatMessage';
import usePlanAndUsage from 'hooks/usePlanAndUsage';
import useSubscription from 'hooks/useSubscription';

export default function UsageDataInformation() {
  const formatMessage = useFormatMessage();
  const { data: currentUserData } = useCurrentUser();
  const userId = currentUserData?.data?.id;
  const { data: planAndUsageData, isLoading: isPlanLoading } =
    usePlanAndUsage(userId);
  const { data: subscriptionData, isLoading: isSubscriptionLoading } =
    useSubscription(userId);

  const planAndUsage = planAndUsageData?.data;
  const subscription = subscriptionData?.data;

  if (isPlanLoading || isSubscriptionLoading) {
    return <Skeleton variant="rounded" height={180} />;
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack gap={2}>
          <Typography variant="h6">
            {formatMessage('usageDataInformation.subscriptionPlan')}
          </Typography>
          <Typography>
            {subscription?.name ||
              planAndUsage?.subscriptionPlan?.name ||
              formatMessage('usageDataInformation.freeTrial')}
          </Typography>

          <Typography variant="h6">
            {formatMessage('usageDataInformation.yourUsage')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatMessage('usageDataInformation.yourUsageDescription')}
          </Typography>
          <Typography>
            {formatMessage('usageDataInformation.yourUsageTasks')}:{' '}
            {planAndUsage?.usage?.taskCount ??
              planAndUsage?.usageData?.consumedTaskCount ??
              0}
          </Typography>

          {subscription?.nextBillAmount && (
            <Typography>
              {formatMessage('usageDataInformation.nextBillAmount')}:{' '}
              {subscription.nextBillAmount}
            </Typography>
          )}

          <Button
            component={Link}
            to={URLS.SETTINGS_PLAN_UPGRADE}
            variant="contained"
          >
            {formatMessage('usageDataInformation.upgrade')}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
