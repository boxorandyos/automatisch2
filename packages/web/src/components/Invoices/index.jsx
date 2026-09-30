import * as React from 'react';
import { DateTime } from 'luxon';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import useCurrentUser from 'hooks/useCurrentUser';
import useFormatMessage from 'hooks/useFormatMessage';
import useInvoices from 'hooks/useInvoices';

export default function Invoices() {
  const formatMessage = useFormatMessage();
  const { data: currentUserData } = useCurrentUser();
  const userId = currentUserData?.data?.id;
  const { data, isLoading } = useInvoices(userId);
  const invoices = data?.data;

  if (isLoading || !invoices?.length) {
    return null;
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack gap={2}>
          <Typography variant="h6">
            {formatMessage('invoices.invoices')}
          </Typography>

          <Divider />

          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 5 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {formatMessage('invoices.date')}
              </Typography>
            </Box>
            <Box sx={{ flex: 5 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {formatMessage('invoices.amount')}
              </Typography>
            </Box>
            <Box sx={{ flex: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {formatMessage('invoices.invoice')}
              </Typography>
            </Box>
          </Stack>

          <Divider />

          {invoices.map((invoice) => (
            <React.Fragment key={invoice.id}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ flex: 5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {DateTime.fromISO(invoice.payout_date).toFormat(
                      'LLL dd, yyyy',
                    )}
                  </Typography>
                </Box>
                <Box sx={{ flex: 5 }}>
                  <Typography variant="body2">
                    {invoice.currency ? `${invoice.currency} ` : '€'}
                    {invoice.amount}
                  </Typography>
                </Box>
                <Box sx={{ flex: 2 }}>
                  {invoice.receipt_url ? (
                    <Link href={invoice.receipt_url} target="_blank" rel="noreferrer">
                      {formatMessage('invoices.link')}
                    </Link>
                  ) : (
                    <Typography variant="body2">—</Typography>
                  )}
                </Box>
              </Stack>
              <Divider />
            </React.Fragment>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
