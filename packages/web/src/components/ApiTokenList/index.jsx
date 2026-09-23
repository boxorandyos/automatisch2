import * as React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { DateTime } from 'luxon';

import DeleteApiTokenButton from 'components/DeleteApiTokenButton';
import ListLoader from 'components/ListLoader';
import useAdminApiTokens from 'hooks/useAdminApiTokens';
import useFormatMessage from 'hooks/useFormatMessage';

export default function ApiTokenList() {
  const formatMessage = useFormatMessage();
  const { data, isLoading } = useAdminApiTokens();
  const tokens = data?.data || [];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {formatMessage('adminApiTokenList.token')}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {formatMessage('adminApiTokenList.createdAt')}
              </Typography>
            </TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && (
            <ListLoader rowsNumber={3} columnsNumber={2} />
          )}
          {!isLoading &&
            tokens.map((token) => {
              const createdAt = DateTime.fromMillis(
                parseInt(token.createdAt, 10),
              );
              return (
                <TableRow key={token.id}>
                  <TableCell>••••{token.token}</TableCell>
                  <TableCell>
                    {createdAt.isValid
                      ? createdAt.toLocaleString(DateTime.DATETIME_MED)
                      : ''}
                  </TableCell>
                  <TableCell align="right">
                    <DeleteApiTokenButton apiTokenId={token.id} />
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
