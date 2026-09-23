const publicTemplateSerializer = (template) => {
  return {
    id: template.id,
    name: template.name,
  };
};

export default publicTemplateSerializer;
