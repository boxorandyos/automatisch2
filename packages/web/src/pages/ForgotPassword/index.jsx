import Box from '@mui/material/Box';

import Container from 'components/Container';
import ForgotPasswordForm from 'components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flex: 1,
      }}
    >
      <Container maxWidth="sm">
        <ForgotPasswordForm />
      </Container>
    </Box>
  );
}
