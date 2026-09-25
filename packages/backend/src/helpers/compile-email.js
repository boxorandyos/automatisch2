import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Handlebars from 'handlebars';

const emailViewsRoot = join(
  dirname(fileURLToPath(import.meta.url)),
  '../views/emails'
);

/**
 * Render a Handlebars email template from views/emails/<name>.hbs.
 * @param {string} templateName template basename without extension
 * @param {Record<string, unknown>} [context]
 * @returns {string} rendered HTML
 */
export default function compileEmail(templateName, context = {}) {
  const absolutePath = join(emailViewsRoot, `${templateName}.hbs`);
  const rawTemplate = readFileSync(absolutePath, 'utf8');
  const render = Handlebars.compile(rawTemplate);

  return render(context);
}
