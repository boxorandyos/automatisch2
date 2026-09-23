import { renderObject } from '@/helpers/renderer.js';
import Config from '@/models/config.js';

export default async function updateConfig(request, response) {
  const config = await Config.update(configParams(request));

  renderObject(response, config);
}

const configParams = (request) => {
  const body = request.body;
  const nextValues = {};

  const updatableFields = [
    'logoSvgData',
    'palettePrimaryDark',
    'palettePrimaryLight',
    'palettePrimaryMain',
    'title',
    'enableTemplates',
    'enableFooter',
    'footerLogoSvgData',
    'footerCopyrightText',
    'footerBackgroundColor',
    'footerTextColor',
    'footerDocsUrl',
    'footerTosUrl',
    'footerPrivacyPolicyUrl',
    'footerImprintUrl',
    'defaultAiProvider',
    'defaultAiProviderKey',
  ];

  for (const field of updatableFields) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      nextValues[field] = body[field];
    }
  }

  return nextValues;
};
