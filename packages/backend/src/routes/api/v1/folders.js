import { Router } from 'express';

import createFolderAction from '@/controllers/api/v1/users/create-folder.js';
import deleteFolderAction from '@/controllers/api/v1/users/delete-folder.js';
import getFoldersAction from '@/controllers/api/v1/users/get-folders.js';
import updateFolderAction from '@/controllers/api/v1/users/update-folder.js';

const router = Router({ mergeParams: true });

router.get('/', getFoldersAction);
router.post('/', createFolderAction);
router.patch('/:folderId', updateFolderAction);
router.delete('/:folderId', deleteFolderAction);

export default router;
