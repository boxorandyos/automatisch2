import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  let form = await request.currentUser
    .$relatedQuery('forms')
    .findById(request.params.formId)
    .throwIfNotFound();

  form = await form.$query().patchAndFetch({
    name: request.body.name,
    displayName: request.body.displayName,
    fields: request.body.fields,
    description: request.body.description,
    responseMessage: request.body.responseMessage,
    submitButtonText: request.body.submitButtonText,
  });

  renderObject(response, form);
};
