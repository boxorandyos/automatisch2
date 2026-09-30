import Crypto from 'crypto';
import isEmpty from 'lodash/isEmpty.js';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New form submission',
  key: 'newFormSubmission',
  type: 'webhook',
  showWebhookUrl: true,
  description: 'Triggers when a form receives a new submission.',
  arguments: [
    {
      label: 'Form',
      key: 'formId',
      type: 'dropdown',
      required: true,
      description: 'Form to receive submissions for',
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [{ name: 'key', value: 'listForms' }],
      },
    },
    {
      label: 'Wait until flow is done',
      key: 'workSynchronously',
      type: 'dropdown',
      required: true,
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
    {
      label: 'Async redirect URL',
      key: 'asyncRedirectUrl',
      type: 'string',
      required: false,
      description:
        'Optional URL to redirect to after async (non-blocking) form submission.',
      variables: true,
    },
  ],

  async run($) {
    const dataItem = {
      raw: {
        headers: $.request.headers,
        body: $.request.body,
        query: $.request.query,
      },
      meta: {
        internalId: Crypto.randomUUID(),
      },
    };

    $.pushTriggerItem(dataItem);
  },

  async testRun($) {
    const lastExecutionStep = await $.getLastExecutionStep();

    if (!isEmpty(lastExecutionStep?.dataOut)) {
      $.pushTriggerItem({
        raw: lastExecutionStep.dataOut,
        meta: {
          internalId: '',
        },
      });
    }
  },
});
