import Box from '@mui/material/Box';

import Container from 'components/Container';
import ResetPasswordForm from 'components/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flex: 1,
      }}
    >
      <Container maxWidth="sm">
        <ResetPasswordForm />
      </Container>
    </Box>
  );
}
