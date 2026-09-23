import ExecutionStep from '@/models/execution-step.js';
import User from '@/models/user.js';

/**
 * Hard-delete a previously soft-removed user and related CE records.
 * Runs as a delayed BullMQ job after softRemove().
 */
export async function deleteUserJob(job) {
  const userId = job.data.id;

  const user = await User.query()
    .withSoftDeleted()
    .findById(userId)
    .throwIfNotFound();

  const executionRows = await user
    .$relatedQuery('executions')
    .withSoftDeleted()
    .select('executions.id');

  const executionIds = executionRows.map((row) => row.id);

  await ExecutionStep.query()
    .withSoftDeleted()
    .whereIn('execution_id', executionIds)
    .hardDelete();

  await user.$relatedQuery('executions').withSoftDeleted().hardDelete();
  await user.$relatedQuery('steps').withSoftDeleted().hardDelete();
  await user.$relatedQuery('flows').withSoftDeleted().hardDelete();
  await user.$relatedQuery('connections').withSoftDeleted().hardDelete();
  await user.$relatedQuery('accessTokens').withSoftDeleted().hardDelete();

  await user.$query().withSoftDeleted().hardDelete();
}
