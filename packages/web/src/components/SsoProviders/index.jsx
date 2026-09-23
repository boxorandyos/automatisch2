import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import useFormatMessage from 'hooks/useFormatMessage';
import useSamlAuthProviders from 'hooks/useSamlAuthProviders';

export default function SsoProviders() {
  const formatMessage = useFormatMessage();
  const { data, isLoading } = useSamlAuthProviders();
  const providers = (data?.data || []).filter((provider) => provider.active);

  if (isLoading || !providers.length) {
    return null;
  }

  return (
    <Stack gap={2} sx={{ mt: 2 }}>
      <Divider />
      {providers.map((provider) => (
        <Button
          key={provider.id}
          variant="outlined"
          color="primary"
          fullWidth
          href={provider.loginUrl}
          data-test="sso-provider-button"
        >
          {formatMessage('ssoProviders.loginWithProvider', {
            providerName: provider.name,
          })}
        </Button>
      ))}
    </Stack>
  );
}
