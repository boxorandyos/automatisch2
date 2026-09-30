import { generateWorker } from '@/workers/worker.js';
import { deleteUserJob } from '@/jobs/delete-user.js';

const QUEUE_NAME = 'delete-user';

const deleteUserWorker = generateWorker(QUEUE_NAME, deleteUserJob);

export default deleteUserWorker;
