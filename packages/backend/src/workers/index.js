import emailWorker from '@/workers/email.js';
import flowWorker from '@/workers/flow.js';
import deleteUserWorker from '@/workers/delete-user.js';

const workers = [emailWorker, flowWorker, deleteUserWorker];

export default workers;
