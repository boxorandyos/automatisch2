const publicUserInvitationSerializer = (user) => {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    status: user.status,
  };
};

export default publicUserInvitationSerializer;
