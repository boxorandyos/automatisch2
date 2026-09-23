import { generateQueue } from '@/queues/queue.js';

const QUEUE_NAME = 'delete-user';

const deleteUserQueue = generateQueue(QUEUE_NAME);

export default deleteUserQueue;
