const formSerializer = (form) => {
  return {
    id: form.id,
    name: form.name,
    displayName: form.displayName,
    fields: form.fields,
    description: form.description,
    responseMessage: form.responseMessage,
    submitButtonText: form.submitButtonText,
    createdAt: form.createdAt.getTime(),
    updatedAt: form.updatedAt.getTime(),
  };
};

export default formSerializer;
