import { generateWorker } from '@/workers/worker.js';
import { deleteUserJob } from '@/jobs/delete-user.js';

const deleteUserWorker = generateWorker('delete-user', deleteUserJob);

export default deleteUserWorker;
