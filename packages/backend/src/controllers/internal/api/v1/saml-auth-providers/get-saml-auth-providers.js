import { renderObject } from '@/helpers/renderer.js';
import SamlAuthProvider from '@/models/saml-auth-provider.js';

export default async (request, response) => {
  const samlAuthProviders = await SamlAuthProvider.query()
    .where({ active: true })
    .orderBy('name', 'asc');

  renderObject(response, samlAuthProviders, {
    serializer: 'SamlAuthProvider',
  });
};
