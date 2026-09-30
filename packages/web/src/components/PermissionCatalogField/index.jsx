import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import * as React from 'react';

import useFormatMessage from 'hooks/useFormatMessage';
import usePermissionCatalog from 'hooks/usePermissionCatalog';
import AllEntitiesPermissions from './AllEntitiesPermissions';
import OwnEntitiesPermission from './OwnEntitiesPermission';

export default function PermissionCatalogField({
  name = 'permissions',
  disabled = false,
  loading = false,
}) {
  const formatMessage = useFormatMessage();
  const { data, isLoading } = usePermissionCatalog();
  const permissionCatalog = data?.data;

  if (isLoading || loading || !permissionCatalog) {
    return (
      <TableContainer data-test="permissions-catalog" component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="body2">…</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer data-test="permissions-catalog" component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell component="th" />
            {permissionCatalog.actions.map((action) => (
              <React.Fragment key={action.key}>
                <TableCell component="th">
                  <Typography
                    component="div"
                    variant="subtitle2"
                    align="center"
                    sx={{ color: 'text.secondary', fontWeight: 700 }}
                  >
                    {action.label}{' '}
                    {formatMessage('permissionCatalogField.ownEntitiesLabel')}
                  </Typography>
                </TableCell>
                <TableCell component="th">
                  <Typography
                    component="div"
                    variant="subtitle2"
                    align="center"
                    sx={{ color: 'text.secondary', fontWeight: 700 }}
                  >
                    {action.label}{' '}
                    {formatMessage('permissionCatalogField.allEntitiesLabel')}
                  </Typography>
                </TableCell>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {permissionCatalog.subjects.map((subject) => (
            <TableRow
              key={subject.key}
              sx={{ '&:last-child td': { border: 0 } }}
              data-test={`${subject.key}-permission-row`}
            >
              <TableCell scope="row">
                <Typography variant="subtitle2" component="div">
                  {subject.label}
                </Typography>
              </TableCell>
              {permissionCatalog.actions.map((action) => (
                <React.Fragment key={`${subject.key}.${action.key}`}>
                  <TableCell align="center">
                    {action.subjects.includes(subject.key) ? (
                      <OwnEntitiesPermission
                        action={action}
                        subject={subject}
                        disabled={disabled}
                        name={name}
                      />
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {action.subjects.includes(subject.key) ? (
                      <AllEntitiesPermissions
                        action={action}
                        subject={subject}
                        disabled={disabled}
                        name={name}
                      />
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

PermissionCatalogField.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
};
