import { Router } from 'express';

import getSamlAuthProvidersAction from '@/controllers/internal/api/v1/saml-auth-providers/get-saml-auth-providers.js';

const router = Router();

router.get('/', getSamlAuthProvidersAction);

export default router;
