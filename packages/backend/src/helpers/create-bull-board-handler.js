import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js';
import flowQueue from '@/queues/flow.js';
import emailQueue from '@/queues/email.js';
import deleteUserQueue from '@/queues/delete-user.js';
import appConfig from '@/config/app.js';

const serverAdapter = new ExpressAdapter();

const queues = [
  new BullMQAdapter(flowQueue),
  new BullMQAdapter(emailQueue),
  new BullMQAdapter(deleteUserQueue),
];

const shouldEnableBullDashboard = () => {
  return (
    appConfig.enableBullMQDashboard &&
    appConfig.bullMQDashboardUsername &&
    appConfig.bullMQDashboardPassword
  );
};

const createBullBoardHandler = async (serverAdapter) => {
  if (!shouldEnableBullDashboard) return;

  createBullBoard({
    queues,
    serverAdapter,
  });
};

export { createBullBoardHandler, serverAdapter };
