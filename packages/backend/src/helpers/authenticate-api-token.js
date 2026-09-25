import ApiToken from '@/models/api-token.js';

const authenticateApiToken = async (request, response, next) => {
  const token = request.headers['x-api-token'];

  if (!token) {
    return response.status(401).end();
  }

  try {
    const apiToken = await ApiToken.query()
      .findOne({ token })
      .throwIfNotFound();

    request.apiToken = apiToken;
    next();
  } catch {
    return response.status(401).end();
  }
};

export default authenticateApiToken;
