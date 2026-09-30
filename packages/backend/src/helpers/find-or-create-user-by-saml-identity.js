import Identity from '@/models/identity.js';
import User from '@/models/user.js';

const fullNameFromProfile = (profile, samlAuthProvider) => {
  const firstName = profile[samlAuthProvider.firstnameAttributeName];
  const surname = profile[samlAuthProvider.surnameAttributeName];

  return [firstName, surname].filter(Boolean).join(' ').trim();
};

const resolveRoleId = async (profile, samlAuthProvider) => {
  const remoteRoleName = profile[samlAuthProvider.roleAttributeName];
  const roleMappings = await samlAuthProvider.$relatedQuery('roleMappings');

  const matchedMapping = roleMappings.find(
    (roleMapping) => roleMapping.remoteRoleName === remoteRoleName
  );

  return matchedMapping?.roleId || samlAuthProvider.defaultRoleId;
};

const findOrCreateUserBySamlIdentity = async (profile, samlAuthProvider) => {
  const email = profile[samlAuthProvider.emailAttributeName]?.toLowerCase();
  const fullName = fullNameFromProfile(profile, samlAuthProvider);
  const remoteId = profile.nameID || email;
  const roleId = await resolveRoleId(profile, samlAuthProvider);

  if (!email || !remoteId) {
    throw new Error('SAML profile is missing required identity attributes.');
  }

  const existingIdentity = await Identity.query().findOne({
    remoteId,
    providerId: samlAuthProvider.id,
    providerType: 'saml',
  });

  if (existingIdentity) {
    const user = await existingIdentity.$relatedQuery('user').throwIfNotFound();

    return await user.$query().patchAndFetch({
      email,
      fullName: fullName || user.fullName,
      roleId: roleId || user.roleId,
    });
  }

  let user = await User.query().findOne({ email });

  if (user) {
    user = await user.$query().patchAndFetch({
      fullName: fullName || user.fullName,
      roleId: roleId || user.roleId,
    });
  } else {
    user = await User.query().insertAndFetch({
      email,
      fullName: fullName || email,
      roleId,
    });
  }

  await Identity.query().insert({
    userId: user.id,
    remoteId,
    providerId: samlAuthProvider.id,
    providerType: 'saml',
  });

  return user;
};

export default findOrCreateUserBySamlIdentity;
