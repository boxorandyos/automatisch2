import PropTypes from 'prop-types';
import * as React from 'react';
import { useParams } from 'react-router-dom';

import AdminApplicationOAuthClientDialog from 'components/AdminApplicationOAuthClientDialog';
import useAdminOAuthClient from 'hooks/useAdminOAuthClient';
import useAdminUpdateOAuthClient from 'hooks/useAdminUpdateOAuthClient';
import useAppAuth from 'hooks/useAppAuth';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useFormatMessage from 'hooks/useFormatMessage';

export default function AdminUpdateOAuthClient({ appKey, onClose }) {
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
  const { oauthClientId } = useParams();
  const { data: adminOAuthClient, isLoading } = useAdminOAuthClient(
    appKey,
    oauthClientId,
  );
  const { data: auth } = useAppAuth(appKey);
  const {
    mutateAsync: updateOAuthClient,
    isPending,
    error,
  } = useAdminUpdateOAuthClient(appKey, oauthClientId);

  const authFields = auth?.data?.fields;

  const getAuthFieldsDefaultValues = React.useCallback(() => {
    if (!authFields) {
      return {};
    }

    const values = {};
    authFields.forEach((field) => {
      if (field.value || field.type !== 'string') {
        values[field.key] = field.value;
      } else if (field.type === 'string') {
        values[field.key] = '';
      }
    });
    return values;
  }, [authFields]);

  const defaultValues = React.useMemo(
    () => ({
      name: adminOAuthClient?.data?.name || '',
      active: adminOAuthClient?.data?.active || false,
      ...getAuthFieldsDefaultValues(),
      ...(adminOAuthClient?.data?.formattedAuthDefaults || {}),
    }),
    [adminOAuthClient, getAuthFieldsDefaultValues],
  );

  const submitHandler = async (values) => {
    const { name, active, ...formattedAuthDefaults } = values;
    await updateOAuthClient({
      name,
      active,
      formattedAuthDefaults,
    });
    enqueueSnackbar(formatMessage('updateOAuthClient.success'), {
      variant: 'success',
    });
    onClose();
  };

  return (
    <AdminApplicationOAuthClientDialog
      onClose={onClose}
      error={error}
      title={formatMessage('updateOAuthClient.title')}
      loading={isLoading}
      submitHandler={submitHandler}
      authFields={authFields}
      submitting={isPending}
      defaultValues={defaultValues}
      disabled={!adminOAuthClient}
    />
  );
}

AdminUpdateOAuthClient.propTypes = {
  appKey: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
