import { renderObject } from '@/helpers/renderer.js';
import User from '@/models/user.js';
import Role from '@/models/role.js';

export default async (request, response) => {
  const user = await User.query().insertAndFetch({
    fullName: request.body.fullName,
    email: request.body.email?.toLowerCase(),
    roleId: request.body.roleId || (await Role.findAdmin()).id,
    status: 'invited',
  });

  await user.sendInvitationEmail();

  renderObject(response, user, {
    status: 201,
    serializer: 'PublicUserInvitation',
  });
};
