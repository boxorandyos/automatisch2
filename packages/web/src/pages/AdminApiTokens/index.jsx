import * as React from 'react';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import LoadingButton from '@mui/lab/LoadingButton';

import ApiTokenList from 'components/ApiTokenList';
import Container from 'components/Container';
import CreatedApiTokenDialog from 'components/CreatedApiTokenDialog';
import NoResultFound from 'components/NoResultFound';
import PageTitle from 'components/PageTitle';
import useAdminApiTokens from 'hooks/useAdminApiTokens';
import useAdminCreateApiToken from 'hooks/useAdminCreateApiToken';
import useFormatMessage from 'hooks/useFormatMessage';

export default function AdminApiTokens() {
  const formatMessage = useFormatMessage();
  const { data, isLoading } = useAdminApiTokens();
  const tokens = data?.data || [];
  const { mutateAsync: createToken, isPending } = useAdminCreateApiToken();
  const [createdToken, setCreatedToken] = React.useState(null);

  const handleCreate = async () => {
    const response = await createToken();
    setCreatedToken(
      response?.data?.token ||
        response?.data?.fullToken ||
        response?.token ||
        response?.fullToken,
    );
  };

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid container sx={{ mb: [0, 3] }} columnSpacing={1.5} rowSpacing={3}>
          <Grid container item xs sm alignItems="center">
            <PageTitle data-test="admin-api-tokens-page-title">
              {formatMessage('adminApiTokensPage.title')}
            </PageTitle>
          </Grid>
          <Grid container item xs="auto" alignItems="center">
            <LoadingButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              loading={isPending}
              data-test="create-token-button"
            >
              {formatMessage('adminApiTokensPage.createApiToken')}
            </LoadingButton>
          </Grid>
        </Grid>

        {!isLoading && !tokens.length ? (
          <NoResultFound
            text={formatMessage('adminApiTokensPage.noApiTokens')}
          />
        ) : (
          <ApiTokenList loading={isLoading} apiTokens={tokens} />
        )}
      </Grid>

      <CreatedApiTokenDialog
        open={!!createdToken}
        apiToken={createdToken}
        onClose={() => setCreatedToken(null)}
      />
    </Container>
  );
}
