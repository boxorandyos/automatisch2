import * as React from 'react';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Container from 'components/Container';
import Form from 'components/Form';
import TextField from 'components/TextField';
import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import useRegisterUser from 'hooks/useRegisterUser';

const getValidationSchema = (formatMessage) =>
  yup.object().shape({
    fullName: yup
      .string()
      .trim()
      .required(
        formatMessage('signupForm.mandatoryInput', {
          inputName: formatMessage('signupForm.fullNameFieldLabel'),
        }),
      ),
    email: yup
      .string()
      .trim()
      .email(formatMessage('signupForm.validateEmail'))
      .required(
        formatMessage('signupForm.mandatoryInput', {
          inputName: formatMessage('signupForm.emailFieldLabel'),
        }),
      ),
    password: yup
      .string()
      .min(6, formatMessage('signupForm.passwordMinLength'))
      .required(
        formatMessage('signupForm.mandatoryInput', {
          inputName: formatMessage('signupForm.passwordFieldLabel'),
        }),
      ),
    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref('password')],
        formatMessage('signupForm.passwordsMustMatch'),
      )
      .required(
        formatMessage('signupForm.mandatoryInput', {
          inputName: formatMessage('signupForm.confirmPasswordFieldLabel'),
        }),
      ),
  });

export default function SignUp() {
  const formatMessage = useFormatMessage();
  const { mutateAsync: registerUser, isPending, isSuccess } = useRegisterUser();

  const handleSubmit = async (values) => {
    try {
      await registerUser({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });
    } catch (error) {
      const errors = error?.response?.data?.errors;
      throw errors || error;
    }
  };

  return (
    <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Form
          onSubmit={handleSubmit}
          resolver={yupResolver(getValidationSchema(formatMessage))}
          defaultValues={{
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          render={({ formState: { errors } }) => (
            <Stack gap={2}>
              <TextField
                name="fullName"
                label={formatMessage('signupForm.fullNameFieldLabel')}
                fullWidth
                required
              />
              <TextField
                name="email"
                label={formatMessage('signupForm.emailFieldLabel')}
                fullWidth
                required
              />
              <TextField
                name="password"
                label={formatMessage('signupForm.passwordFieldLabel')}
                type="password"
                fullWidth
                required
              />
              <TextField
                name="confirmPassword"
                label={formatMessage('signupForm.confirmPasswordFieldLabel')}
                type="password"
                fullWidth
                required
              />
              {errors?.root?.general && (
                <Alert severity="error">{errors.root.general.message}</Alert>
              )}
              {isSuccess && (
                <Alert severity="success">
                  Account created. You can{' '}
                  <Link component={RouterLink} to={URLS.LOGIN}>
                    log in
                  </Link>
                  .
                </Alert>
              )}
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isPending}
              >
                {formatMessage('signupForm.submit')}
              </LoadingButton>
            </Stack>
          )}
        />
      </Container>
    </Box>
  );
}
