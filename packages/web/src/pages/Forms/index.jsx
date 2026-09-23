import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import * as React from 'react';
import { Link } from 'react-router-dom';

import ConditionalIconButton from 'components/ConditionalIconButton';
import Container from 'components/Container';
import FormRow from 'components/FormRow';
import NoResultFound from 'components/NoResultFound';
import PageTitle from 'components/PageTitle';
import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import useForms from 'hooks/useForms';

export default function Forms() {
  const formatMessage = useFormatMessage();
  const { data, isLoading } = useForms();
  const forms = data?.data || [];

  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Grid container sx={{ mb: [0, 3] }} columnSpacing={1.5} rowSpacing={3}>
          <Grid container item xs sm alignItems="center">
            <PageTitle>{formatMessage('formsPage.title')}</PageTitle>
          </Grid>
          <Grid container item xs="auto" alignItems="center">
            <ConditionalIconButton
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              component={Link}
              to={URLS.CREATE_FORM}
              fullWidth
              icon={<AddIcon />}
            >
              {formatMessage('formsPage.createForm')}
            </ConditionalIconButton>
          </Grid>
        </Grid>

        <Divider sx={{ mt: [2, 0], mb: 2 }} />

        {isLoading && (
          <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
        )}

        {!isLoading && !forms.length && (
          <NoResultFound
            text={formatMessage('formsPage.noForms')}
            to={URLS.CREATE_FORM}
          />
        )}

        {!isLoading &&
          forms.map((form) => <FormRow key={form.id} form={form} />)}
      </Container>
    </Box>
  );
}
