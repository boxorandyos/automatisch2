import * as React from 'react';
import Box from '@mui/material/Box';
import Container from 'components/Container';
import ForgotPasswordForm from 'components/ForgotPasswordForm/index';

export default function ForgotPassword() {
  return (
    <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
      <Container maxWidth="sm">
        <ForgotPasswordForm />
      </Container>
    </Box>
  );
}
