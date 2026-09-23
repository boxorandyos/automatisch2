import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import {
  processOpenWithPopup,
  processPopupMessage,
} from 'helpers/authenticationSteps';
import computeAuthStepVariables from 'helpers/computeAuthStepVariables';
import useAppAuth from 'hooks/useAppAuth';
import useCreateConnection from 'hooks/useCreateConnection';
import useCreateConnectionAuthUrl from 'hooks/useCreateConnectionAuthUrl';
import useFormatMessage from 'hooks/useFormatMessage';
import useResetConnection from 'hooks/useResetConnection';
import useUpdateConnection from 'hooks/useUpdateConnection';
import useVerifyConnection from 'hooks/useVerifyConnection';

function resolveAuthSteps(authPayload, { reconnecting, shared }) {
  if (!authPayload) {
    return undefined;
  }

  if (reconnecting && shared) {
    return authPayload.sharedReconnectionSteps;
  }

  if (reconnecting) {
    return authPayload.reconnectionSteps;
  }

  if (shared) {
    return authPayload.sharedAuthenticationSteps;
  }

  return authPayload.authenticationSteps;
}

/**
 * Runs the connection authentication step list for an app.
 * Returns { authenticate, inProgress }.
 */
export default function useAuthenticateApp({
  appKey,
  connectionId,
  oauthClientId,
  useShared = false,
} = {}) {
  const queryClient = useQueryClient();
  const formatMessage = useFormatMessage();
  const { data: authResponse } = useAppAuth(appKey);

  const { mutateAsync: createConnection } = useCreateConnection(appKey);
  const { mutateAsync: createConnectionAuthUrl } = useCreateConnectionAuthUrl();
  const { mutateAsync: updateConnection } = useUpdateConnection();
  const { mutateAsync: resetConnection } = useResetConnection();
  const { mutateAsync: verifyConnection } = useVerifyConnection();

  const [inProgress, setInProgress] = useState(false);

  const steps = useMemo(
    () =>
      resolveAuthSteps(authResponse?.data, {
        reconnecting: Boolean(connectionId),
        shared: useShared,
      }),
    [authResponse, connectionId, useShared],
  );

  const authenticate = useMemo(() => {
    if (!steps?.length) {
      return undefined;
    }

    return async function runAuthentication(options = {}) {
      const { fields, oauthClientId: oauthClientIdOverride } = options;
      setInProgress(true);

      const state = {
        key: appKey,
        oauthClientId: oauthClientId || oauthClientIdOverride,
        connectionId,
        fields,
      };

      try {
        for (const step of steps) {
          const variables = computeAuthStepVariables(step.arguments, state);

          if (step.type === 'openWithPopup') {
            const popup = processOpenWithPopup(variables.url);

            if (!popup) {
              throw new Error(formatMessage('addAppConnection.popupReminder'));
            }

            state[step.name] = await processPopupMessage(popup);
            continue;
          }

          if (step.type !== 'mutation') {
            continue;
          }

          switch (step.name) {
            case 'createConnection': {
              const result = await createConnection(variables);
              state.createConnection = result.data;
              state.connectionId = result.data.id;
              break;
            }
            case 'generateAuthUrl': {
              const result = await createConnectionAuthUrl(state.connectionId);
              state.generateAuthUrl = result.data;
              break;
            }
            case 'updateConnection': {
              const result = await updateConnection({
                ...variables,
                connectionId: state.connectionId,
              });
              state.updateConnection = result.data;
              break;
            }
            case 'resetConnection': {
              const result = await resetConnection(state.connectionId);
              state.resetConnection = result.data;
              break;
            }
            case 'verifyConnection': {
              const result = await verifyConnection(state.connectionId);
              state.verifyConnection = result?.data;
              break;
            }
            default:
              break;
          }
        }

        await queryClient.invalidateQueries({
          queryKey: ['apps', appKey, 'connections'],
        });

        return state;
      } catch (error) {
        await queryClient.invalidateQueries({
          queryKey: ['apps', appKey, 'connections'],
        });
        throw error;
      } finally {
        setInProgress(false);
      }
    };
    // formatMessage omitted intentionally (unstable identity).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    steps,
    appKey,
    oauthClientId,
    connectionId,
    queryClient,
    createConnection,
    createConnectionAuthUrl,
    updateConnection,
    resetConnection,
    verifyConnection,
  ]);

  return { authenticate, inProgress };
}
