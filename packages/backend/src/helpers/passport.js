import { URL } from 'node:url';

import passport from 'passport';
import { MultiSamlStrategy } from '@node-saml/passport-saml';

import appConfig from '@/config/app.js';
import createAuthTokenByUserId from '@/helpers/create-auth-token-by-user-id.js';
import findOrCreateUserBySamlIdentity from '@/helpers/find-or-create-user-by-saml-identity.js';
import SamlAuthProvider from '@/models/saml-auth-provider.js';

const findSamlAuthProvider = async (issuerOrId) => {
  const decoded = decodeURIComponent(issuerOrId);

  return await SamlAuthProvider.query()
    .where({ active: true })
    .andWhere((builder) => {
      builder.where('issuer', decoded).orWhere('id', decoded);
    })
    .first()
    .throwIfNotFound();
};

const getSamlOptions = async (request, done) => {
  try {
    const samlAuthProvider = await findSamlAuthProvider(request.params.issuer);

    request.samlAuthProvider = samlAuthProvider;

    return done(null, samlAuthProvider.config);
  } catch (error) {
    return done(error);
  }
};

const verify = async (request, profile, done) => {
  try {
    const samlAuthProvider =
      request.samlAuthProvider ||
      (await findSamlAuthProvider(request.params.issuer));

    const user = await findOrCreateUserBySamlIdentity(profile, samlAuthProvider);

    return done(null, { user, profile });
  } catch (error) {
    return done(error);
  }
};

export default function configurePassport(app) {
  app.use(
    passport.initialize({
      userProperty: 'currentUser',
    })
  );

  passport.use(
    new MultiSamlStrategy(
      {
        passReqToCallback: true,
        getSamlOptions,
      },
      verify
    )
  );

  app.get(
    '/login/saml/:issuer',
    passport.authenticate('saml', {
      session: false,
      failureRedirect: `${appConfig.webAppUrl}/login`,
    })
  );

  app.post(
    '/login/saml/:issuer/callback',
    passport.authenticate('saml', {
      session: false,
      failureRedirect: `${appConfig.webAppUrl}/login`,
    }),
    async (request, response) => {
      const { user, profile } = request.currentUser;
      const token = await createAuthTokenByUserId(
        user.id,
        profile?.sessionIndex
      );

      const redirectUrl = new URL(`${appConfig.webAppUrl}/login/callback`);
      redirectUrl.searchParams.set('token', token);

      response.redirect(redirectUrl.toString());
    }
  );
}
