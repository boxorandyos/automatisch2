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
  const { data: apiTokensData, isLoading } = useAdminApiTokens();
  const {
    mutateAsync: createToken,
    data: createdApiTokenData,
    isPending,
    reset,
  } = useAdminCreateApiToken();
  const [open, setOpen] = React.useState(false);

  const apiTokens = apiTokensData?.data || [];
  const createdApiToken = createdApiTokenData?.data;

  const onCreateApiToken = async () => {
    await createToken();
    setOpen(true);
  };

  const onDialogClose = () => {
    reset();
    setOpen(false);
  };

  return (
    <>
      <CreatedApiTokenDialog
        open={open}
        onClose={onDialogClose}
        apiToken={createdApiToken?.token}
      />

      <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
        <Grid container item xs={12} sm={10} md={9}>
          <Grid
            container
            sx={{ mb: [0, 3] }}
            columnSpacing={1.5}
            rowSpacing={3}
          >
            <Grid container item xs sm alignItems="center">
              <PageTitle data-test="admin-api-tokens-page-title">
                {formatMessage('adminApiTokensPage.title')}
              </PageTitle>
            </Grid>
            <Grid container item xs="auto" alignItems="center">
              <LoadingButton
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onCreateApiToken}
                loading={isPending}
                data-test="create-token-button"
              >
                {formatMessage('adminApiTokensPage.createApiToken')}
              </LoadingButton>
            </Grid>
          </Grid>

          <Grid item xs={12} justifyContent="flex-end" sx={{ pt: 5 }}>
            {!isLoading && apiTokensData?.meta?.count === 0 && (
              <NoResultFound
                onClick={onCreateApiToken}
                text={formatMessage('adminApiTokensPage.noApiTokens')}
              />
            )}

            {(isLoading || apiTokensData?.meta?.count > 0) && (
              <ApiTokenList apiTokens={apiTokens} loading={isLoading} />
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
