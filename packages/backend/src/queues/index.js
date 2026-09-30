import emailQueue from '@/queues/email.js';
import flowQueue from '@/queues/flow.js';
import deleteUserQueue from '@/queues/delete-user.js';

const queues = [emailQueue, flowQueue, deleteUserQueue];

export default queues;
