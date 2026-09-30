import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import useFormatMessage from 'hooks/useFormatMessage';

const FIELD_TYPES = [
  'string',
  'multiline',
  'checkbox',
  'dropdown',
  'date',
  'time',
  'datetime',
];

export default function FormEditor({ name = 'fields' }) {
  const formatMessage = useFormatMessage();
  const { control, register, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <Stack gap={2} data-test="form-editor">
      <Typography variant="h6">{formatMessage('formEditor.fields')}</Typography>
      <Typography variant="body2" color="text.secondary">
        {formatMessage('formEditor.fieldsHelperText')}
      </Typography>

      {fields.map((field, index) => {
        const fieldType = watch(`${name}.${index}.type`) || 'string';

        return (
          <Box
            key={field.id}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
            }}
          >
            <Stack direction="row" gap={2} alignItems="flex-start">
              <TextField
                label={formatMessage('formEditor.fieldName')}
                fullWidth
                {...register(`${name}.${index}.name`)}
              />

              <FormControl fullWidth>
                <InputLabel>{formatMessage('formEditor.fieldType')}</InputLabel>
                <Controller
                  name={`${name}.${index}.type`}
                  control={control}
                  defaultValue="string"
                  render={({ field: selectField }) => (
                    <Select
                      {...selectField}
                      label={formatMessage('formEditor.fieldType')}
                    >
                      {FIELD_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                          {formatMessage(
                            `formEditor.fieldType${type.charAt(0).toUpperCase()}${type.slice(1)}`,
                          ) || type}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>

              <IconButton onClick={() => remove(index)} aria-label="remove field">
                <DeleteIcon />
              </IconButton>
            </Stack>

            <Stack direction="row" gap={2} mt={1}>
              <Controller
                name={`${name}.${index}.required`}
                control={control}
                defaultValue={false}
                render={({ field: checkboxField }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!checkboxField.value}
                        onChange={(e) => checkboxField.onChange(e.target.checked)}
                      />
                    }
                    label={formatMessage('formEditor.fieldRequired')}
                  />
                )}
              />
              <Controller
                name={`${name}.${index}.readonly`}
                control={control}
                defaultValue={false}
                render={({ field: checkboxField }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!checkboxField.value}
                        onChange={(e) => checkboxField.onChange(e.target.checked)}
                      />
                    }
                    label={formatMessage('formEditor.fieldReadonly')}
                  />
                )}
              />
            </Stack>

            {fieldType === 'dropdown' && (
              <TextField
                sx={{ mt: 1 }}
                label={formatMessage('formEditor.dropdownOptions')}
                helperText="Comma-separated options"
                fullWidth
                {...register(`${name}.${index}.options`)}
              />
            )}
          </Box>
        );
      })}

      <Button
        startIcon={<AddIcon />}
        onClick={() =>
          append({
            name: '',
            type: 'string',
            required: false,
            readonly: false,
          })
        }
      >
        {formatMessage('formEditor.addField')}
      </Button>
    </Stack>
  );
}

FormEditor.propTypes = {
  name: PropTypes.string,
};
