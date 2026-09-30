import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import Form from 'components/Form';
import TextField from 'components/TextField';
import useForgotPassword from 'hooks/useForgotPassword';
import useFormatMessage from 'hooks/useFormatMessage';

export default function ForgotPasswordForm() {
  const formatMessage = useFormatMessage();
  const forgotPassword = useForgotPassword();

  const onSubmit = (values) => {
    forgotPassword.mutate({ email: values.email });
  };

  return (
    <Paper sx={{ px: 2, py: 4 }}>
      <Typography
        align="center"
        gutterBottom
        sx={{
          borderBottom: '1px solid',
          borderColor: (theme) => theme.palette.text.disabled,
          mb: 2,
          pb: 2,
        }}
        variant="h3"
      >
        {formatMessage('forgotPasswordForm.title')}
      </Typography>

      <Form onSubmit={onSubmit}>
        <TextField
          autoComplete="username"
          fullWidth
          label={formatMessage('forgotPasswordForm.emailFieldLabel')}
          margin="dense"
          name="email"
          required
        />

        {forgotPassword.isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {forgotPassword.error?.message ||
              formatMessage('forgotPasswordForm.error')}
          </Alert>
        )}

        {forgotPassword.isSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {formatMessage('forgotPasswordForm.instructionsSent')}
          </Alert>
        )}

        <LoadingButton
          color="primary"
          disabled={forgotPassword.isSuccess}
          fullWidth
          loading={forgotPassword.isPending}
          sx={{ boxShadow: 2, my: 3 }}
          type="submit"
          variant="contained"
        >
          {formatMessage('forgotPasswordForm.submit')}
        </LoadingButton>
      </Form>
    </Paper>
  );
}
