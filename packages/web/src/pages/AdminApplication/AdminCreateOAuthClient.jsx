import PropTypes from 'prop-types';
import * as React from 'react';

import AdminApplicationOAuthClientDialog from 'components/AdminApplicationOAuthClientDialog';
import useAdminCreateAppConfig from 'hooks/useAdminCreateAppConfig';
import useAdminCreateOAuthClient from 'hooks/useAdminCreateOAuthClient';
import useAppAuth from 'hooks/useAppAuth';
import useAppConfig from 'hooks/useAppConfig';
import useFormatMessage from 'hooks/useFormatMessage';

export default function AdminCreateOAuthClient({ appKey, onClose }) {
  const formatMessage = useFormatMessage();
  const { data: auth } = useAppAuth(appKey);
  const { data: appConfig, isLoading: isAppConfigLoading } =
    useAppConfig(appKey);

  const {
    mutateAsync: createAppConfig,
    isPending: isCreateAppConfigPending,
    error: createAppConfigError,
  } = useAdminCreateAppConfig(appKey);

  const {
    mutateAsync: createOAuthClient,
    isPending: isCreateOAuthClientPending,
    error: createOAuthClientError,
  } = useAdminCreateOAuthClient(appKey);

  const submitHandler = async (values) => {
    if (!appConfig?.data?.key) {
      await createAppConfig({
        useOnlyPredefinedAuthClients: false,
        disabled: false,
      });
    }

    const { name, active, ...formattedAuthDefaults } = values;

    await createOAuthClient({
      appKey,
      name,
      active,
      formattedAuthDefaults,
    });

    onClose();
  };

  const getAuthFieldsDefaultValues = React.useCallback(() => {
    if (!auth?.data?.fields) {
      return {};
    }

    const values = {};

    auth.data.fields.forEach((field) => {
      if (field.value || field.type !== 'string') {
        values[field.key] = field.value;
      } else if (field.type === 'string') {
        values[field.key] = '';
      }
    });

    return values;
  }, [auth?.data?.fields]);

  const defaultValues = React.useMemo(
    () => ({
      name: '',
      active: false,
      ...getAuthFieldsDefaultValues(),
    }),
    [getAuthFieldsDefaultValues],
  );

  return (
    <AdminApplicationOAuthClientDialog
      onClose={onClose}
      error={createAppConfigError || createOAuthClientError}
      title={formatMessage('createOAuthClient.title')}
      loading={isAppConfigLoading}
      submitHandler={submitHandler}
      authFields={auth?.data?.fields}
      submitting={isCreateAppConfigPending || isCreateOAuthClientPending}
      defaultValues={defaultValues}
    />
  );
}

AdminCreateOAuthClient.propTypes = {
  appKey: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
