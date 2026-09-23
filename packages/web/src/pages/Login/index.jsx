import * as React from 'react';
import Box from '@mui/material/Box';
import Container from 'components/Container';
import LoginForm from 'components/LoginForm';
import SsoProviders from 'components/SsoProviders';

export default function Login() {
  return (
    <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
      <Container maxWidth="sm">
        <LoginForm />
        <SsoProviders />
      </Container>
    </Box>
  );
}
