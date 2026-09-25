import ApiToken from '@/models/api-token.js';

export default async function deleteApiToken(request, response) {
  const apiToken = await ApiToken.query()
    .findById(request.params.apiTokenId)
    .throwIfNotFound();

  await apiToken.$query().delete();

  response.status(204).end();
}
