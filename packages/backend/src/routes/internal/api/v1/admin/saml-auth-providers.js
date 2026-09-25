import { Router } from 'express';

import { authenticateUser } from '@/helpers/authentication.js';
import { authorizeAdmin } from '@/helpers/authorization.js';
import createSamlAuthProviderAction from '@/controllers/internal/api/v1/admin/saml-auth-providers/create-saml-auth-provider.js';
import getSamlAuthProviderAction from '@/controllers/internal/api/v1/admin/saml-auth-providers/get-saml-auth-provider.js';
import getSamlAuthProvidersAction from '@/controllers/internal/api/v1/admin/saml-auth-providers/get-saml-auth-providers.js';
import updateSamlAuthProviderAction from '@/controllers/internal/api/v1/admin/saml-auth-providers/update-saml-auth-provider.js';
import getRoleMappingsAction from '@/controllers/internal/api/v1/admin/saml-auth-providers/get-role-mappings.js';
import updateRoleMappingsAction from '@/controllers/internal/api/v1/admin/saml-auth-providers/update-role-mappings.js';

const router = Router();

router.get(
  '/',
  authenticateUser,
  authorizeAdmin,
  getSamlAuthProvidersAction
);
router.post(
  '/',
  authenticateUser,
  authorizeAdmin,
  createSamlAuthProviderAction
);
router.get(
  '/:samlAuthProviderId',
  authenticateUser,
  authorizeAdmin,
  getSamlAuthProviderAction
);
router.patch(
  '/:samlAuthProviderId',
  authenticateUser,
  authorizeAdmin,
  updateSamlAuthProviderAction
);
router.get(
  '/:samlAuthProviderId/role-mappings',
  authenticateUser,
  authorizeAdmin,
  getRoleMappingsAction
);
router.patch(
  '/:samlAuthProviderId/role-mappings',
  authenticateUser,
  authorizeAdmin,
  updateRoleMappingsAction
);

export default router;
