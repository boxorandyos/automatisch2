import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';

import Form from 'components/Form';
import TextField from 'components/TextField';
import * as URLS from 'config/urls';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useFormatMessage from 'hooks/useFormatMessage';
import useResetPassword from 'hooks/useResetPassword';

const schema = yup.object({
  password: yup.string().required('resetPasswordForm.mandatoryInput'),
  confirmPassword: yup
    .string()
    .required('resetPasswordForm.mandatoryInput')
    .oneOf([yup.ref('password')], 'resetPasswordForm.passwordsMustMatch'),
});

export default function ResetPasswordForm() {
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetPassword = useResetPassword();
  const token = searchParams.get('token');

  const onSubmit = async ({ password }) => {
    try {
      await resetPassword.mutateAsync({ password, token });
      enqueueSnackbar(formatMessage('resetPasswordForm.passwordUpdated'), {
        variant: 'success',
        SnackbarProps: {
          'data-test': 'snackbar-reset-password-success',
        },
      });
      navigate(URLS.LOGIN);
    } catch (submitError) {
      console.error(submitError);
    }
  };

  const errorMessages = (() => {
    if (!resetPassword.isError) {
      return [];
    }

    return (
      resetPassword.error?.response?.data?.errors?.general || [
        resetPassword.error?.message ||
          formatMessage('resetPasswordForm.error'),
      ]
    );
  })();

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
        {formatMessage('resetPasswordForm.title')}
      </Typography>

      <Form
        mode="onChange"
        onSubmit={onSubmit}
        resolver={yupResolver(schema)}
        render={({ formState: { errors, touchedFields } }) => (
          <>
            <TextField
              error={touchedFields.password && Boolean(errors.password)}
              fullWidth
              helperText={
                touchedFields.password && errors.password?.message
                  ? formatMessage(errors.password.message, {
                      inputName: formatMessage(
                        'resetPasswordForm.passwordFieldLabel',
                      ),
                    })
                  : ''
              }
              label={formatMessage('resetPasswordForm.passwordFieldLabel')}
              margin="dense"
              name="password"
              type="password"
            />

            <TextField
              error={
                touchedFields.confirmPassword && Boolean(errors.confirmPassword)
              }
              fullWidth
              helperText={
                touchedFields.confirmPassword && errors.confirmPassword?.message
                  ? formatMessage(errors.confirmPassword.message, {
                      inputName: formatMessage(
                        'resetPasswordForm.confirmPasswordFieldLabel',
                      ),
                    })
                  : ''
              }
              label={formatMessage(
                'resetPasswordForm.confirmPasswordFieldLabel',
              )}
              margin="dense"
              name="confirmPassword"
              type="password"
            />

            {errorMessages.map((message) => (
              <Alert key={message} severity="error" sx={{ mt: 2 }}>
                {message}
              </Alert>
            ))}

            <LoadingButton
              color="primary"
              disabled={resetPassword.isSuccess || !token}
              fullWidth
              loading={resetPassword.isPending}
              sx={{ boxShadow: 2, my: 3 }}
              type="submit"
              variant="contained"
            >
              {formatMessage('resetPasswordForm.submit')}
            </LoadingButton>
          </>
        )}
      />
    </Paper>
  );
}
