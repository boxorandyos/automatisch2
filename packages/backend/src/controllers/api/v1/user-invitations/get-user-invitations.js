import { renderObject } from '@/helpers/renderer.js';
import paginateRest from '@/helpers/pagination.js';
import User from '@/models/user.js';

export default async (request, response) => {
  const invitationsQuery = User.query()
    .where({ status: 'invited' })
    .orderBy('created_at', 'desc');

  const invitations = await paginateRest(invitationsQuery, request.query.page);

  renderObject(response, invitations, {
    serializer: 'PublicUserInvitation',
  });
};
