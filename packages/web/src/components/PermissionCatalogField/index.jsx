import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Skeleton,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import useFormatMessage from 'hooks/useFormatMessage';
import usePermissionCatalog from 'hooks/usePermissionCatalog';

function PermissionCheckbox({ name, label, dataTest }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={false}
      render={({ field: { value, onChange, ...field } }) => (
        <FormControlLabel
          control={
            <Checkbox
              {...field}
              checked={!!value}
              onChange={(event) => onChange(event.target.checked)}
              data-test={dataTest}
            />
          }
          label={label}
        />
      )}
    />
  );
}

PermissionCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  dataTest: PropTypes.string,
};

export default function PermissionCatalogField({ name = 'permissions' }) {
  const formatMessage = useFormatMessage();
  const { data, isLoading } = usePermissionCatalog();
  const catalog = data?.data || data;

  if (isLoading || !catalog) {
    return (
      <Stack gap={1} data-test="permissions-catalog">
        <Skeleton variant="rounded" height={40} />
        <Skeleton variant="rounded" height={120} />
      </Stack>
    );
  }

  const subjects = catalog.subjects || [];
  const actions = catalog.actions || [];

  return (
    <TableContainer component={Paper} data-test="permissions-catalog">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle2">Subject</Typography>
            </TableCell>
            {actions.map((action) => (
              <TableCell key={action.key} align="center">
                <Typography variant="subtitle2">{action.label}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {subjects.map((subject) => (
            <TableRow
              key={subject.key}
              data-test={`${subject.key}-permission-row`}
            >
              <TableCell>
                <Typography variant="body2">{subject.label}</Typography>
              </TableCell>
              {actions.map((action) => {
                const applicable = action.subjects?.includes(subject.key);
                if (!applicable) {
                  return <TableCell key={action.key} />;
                }

                return (
                  <TableCell key={action.key} align="center">
                    <Stack>
                      <PermissionCheckbox
                        name={`${name}.${subject.key}.${action.key}.isCreator`}
                        label={formatMessage(
                          'permissionCatalogField.ownEntitiesLabel',
                        )}
                        dataTest={`isCreator-${action.key}-checkbox`}
                      />
                      <PermissionCheckbox
                        name={`${name}.${subject.key}.${action.key}.all`}
                        label={formatMessage(
                          'permissionCatalogField.allEntitiesLabel',
                        )}
                        dataTest={`${action.key}-checkbox`}
                      />
                    </Stack>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

PermissionCatalogField.propTypes = {
  name: PropTypes.string,
};
