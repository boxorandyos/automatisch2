import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';

import Container from 'components/Container';
import useCreateFormSubmission from 'hooks/useCreateFormSubmission';
import useFlowForm from 'hooks/useFlowForm';
import useFormatMessage from 'hooks/useFormatMessage';

function FormField({ field, value, onChange }) {
  const formatMessage = useFormatMessage();

  if (field.type === 'checkbox') {
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            disabled={field.readonly}
          />
        }
        label={field.name}
      />
    );
  }

  if (field.type === 'dropdown') {
    const options = Array.isArray(field.options) ? field.options : [];
    return (
      <FormControl fullWidth required={field.required}>
        <InputLabel>{field.name}</InputLabel>
        <Select
          label={field.name}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={field.readonly}
        >
          <MenuItem value="">
            <em>{formatMessage('formFlow.chooseOption')}</em>
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  const multiline = field.type === 'multiline';
  let inputType = 'text';
  if (field.type === 'date') inputType = 'date';
  if (field.type === 'time') inputType = 'time';
  if (field.type === 'datetime') inputType = 'datetime-local';

  return (
    <TextField
      label={field.name}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      required={field.required}
      disabled={field.readonly}
      multiline={multiline}
      minRows={multiline ? 3 : undefined}
      type={inputType}
      InputLabelProps={
        ['date', 'time', 'datetime'].includes(field.type)
          ? { shrink: true }
          : undefined
      }
    />
  );
}

FormField.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};

export default function FormFlow() {

  const formatMessage = useFormatMessage();
  const { flowId } = useParams();
  const { data, isLoading, isError } = useFlowForm(flowId);
  const form = data?.data;
  const { mutateAsync: submitForm, isPending } = useCreateFormSubmission();
  const [values, setValues] = React.useState({});
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(null);

  if (isLoading) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>{formatMessage('formFlow.loading')}</Typography>
      </Box>
    );
  }

  if (isError || !form) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">{formatMessage('genericError')}</Alert>
      </Container>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      if (!form.webhookUrl) {
        throw new Error('Missing webhook URL');
      }
      await submitForm({ webhookUrl: form.webhookUrl, data: values });
      setSuccess(true);
      setValues({});
    } catch (submitError) {
      setError(submitError.message || formatMessage('genericError'));
    }
  };

  return (
    <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', py: 4 }}>
      <Container maxWidth="sm">
        <Stack gap={2} component="form" onSubmit={handleSubmit}>
          <Typography variant="h4">
            {form.displayName || form.name}
          </Typography>
          {form.description && (
            <Typography color="text.secondary">{form.description}</Typography>
          )}

          {(form.fields || []).map((field, index) => (
            <FormField
              key={`${field.name}-${index}`}
              field={field}
              value={values[field.name]}
              onChange={(next) =>
                setValues((prev) => ({ ...prev, [field.name]: next }))
              }
            />
          ))}

          {success && (
            <Alert severity="success">
              {form.responseMessage || formatMessage('formFlow.successMessage')}
            </Alert>
          )}
          {error && <Alert severity="error">{error}</Alert>}

          <Button type="submit" variant="contained" disabled={isPending}>
            {form.submitButtonText || formatMessage('formFlow.submitButton')}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
