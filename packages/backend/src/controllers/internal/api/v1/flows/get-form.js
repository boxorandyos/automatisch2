import Flow from '@/models/flow.js';
import Form from '@/models/form.js';
import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  const flow = await Flow.query()
    .findById(request.params.flowId)
    .throwIfNotFound();

  const triggerStep = await flow.getTriggerStep();
  const formId = triggerStep?.parameters?.formId;

  if (!formId) {
    return response.status(404).end();
  }

  const form = await Form.query().findById(formId).throwIfNotFound();
  const webhookUrl = await triggerStep.getWebhookUrl();

  renderObject(response, {
    id: form.id,
    name: form.name,
    displayName: form.displayName,
    fields: form.fields,
    description: form.description,
    responseMessage: form.responseMessage,
    submitButtonText: form.submitButtonText,
    webhookUrl,
    asyncRedirectUrl: triggerStep.parameters?.asyncRedirectUrl,
  });
};
