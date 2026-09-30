import { renderObject } from '@/helpers/renderer.js';
import Config from '@/models/config.js';

export default async function getAutomatischConfig(_request, response) {
  const config = await Config.get();

  renderObject(response, config);
}
