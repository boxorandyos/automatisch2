import ApiToken from '@/models/api-token.js';

export const authenticateApiToken = async (request, response, next) => {
  const authorizationHeader = request.headers.authorization || '';
  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  const apiToken = await ApiToken.query().findOne({ token });

  if (!apiToken) {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  request.apiToken = apiToken;
  next();
};

export default authenticateApiToken;
