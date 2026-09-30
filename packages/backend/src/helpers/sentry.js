import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import objection from 'objection';

import appConfig from '@/config/app.js';
import HttpError from '@/errors/http.js';
import NotAuthorizedError from '@/errors/not-authorized.js';
import QuotaExceededError from '@/errors/quote-exceeded.js';

const {
  DataError,
  ForeignKeyViolationError,
  NotFoundError,
  UniqueViolationError,
  ValidationError,
} = objection;

const EXPECTED_ERROR_TYPES = [
  DataError,
  ForeignKeyViolationError,
  HttpError,
  NotAuthorizedError,
  NotFoundError,
  QuotaExceededError,
  UniqueViolationError,
  ValidationError,
];

function sentryIsActive() {
  if (appConfig.isDev || appConfig.isTest) {
    return false;
  }

  return Boolean(appConfig.sentryDsn);
}

function isMissingAppLookup(error) {
  const message = error?.message;
  if (typeof message !== 'string') {
    return false;
  }

  return (
    message.includes('An application with the') &&
    message.includes("key couldn't be found.")
  );
}

function shouldDropEvent(error) {
  if (!error) {
    return false;
  }

  if (error.message === 'Not Found') {
    return true;
  }

  if (isMissingAppLookup(error)) {
    return true;
  }

  return EXPECTED_ERROR_TYPES.some((ErrorType) => error instanceof ErrorType);
}

export function init(app) {
  if (!sentryIsActive()) {
    return;
  }

  return Sentry.init({
    dsn: appConfig.sentryDsn,
    enabled: true,
    tracesSampleRate: 1,
    integrations: [
      app ? new Sentry.Integrations.Http({ tracing: true }) : null,
      app ? new Tracing.Integrations.Express({ app }) : null,
    ].filter(Boolean),
    beforeSend(event, hint) {
      return shouldDropEvent(hint?.originalException) ? null : event;
    },
  });
}

export function attachRequestHandler(app) {
  if (!sentryIsActive()) {
    return;
  }

  app.use(Sentry.Handlers.requestHandler());
}

export function attachTracingHandler(app) {
  if (!sentryIsActive()) {
    return;
  }

  app.use(Sentry.Handlers.tracingHandler());
}

export function attachErrorHandler(app) {
  if (!sentryIsActive()) {
    return;
  }

  app.use(
    Sentry.Handlers.errorHandler({
      shouldHandleError() {
        return true;
      },
    })
  );
}

export function captureException(error, context) {
  if (!sentryIsActive()) {
    return;
  }

  return Sentry.captureException(error, context);
}
