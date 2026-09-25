import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Respond with',
  key: 'respondWith',
  description: 'Respond to the form submission with a custom response.',
  arguments: [
    {
      label: 'Status code',
      key: 'statusCode',
      type: 'string',
      required: true,
      variables: true,
      value: '200',
    },
    {
      label: 'Body',
      key: 'body',
      type: 'string',
      required: true,
      description: 'The content of the response body.',
      variables: true,
    },
  ],

  async run($) {
    const statusCode = parseInt($.step.parameters.statusCode, 10);
    const body = $.step.parameters.body;

    $.setActionItem({
      raw: {
        headers: {},
        body,
        statusCode,
      },
    });
  },
});
