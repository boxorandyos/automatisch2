import defineApp from '../../helpers/define-app.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
  name: 'Agents',
  key: 'agents',
  baseUrl: '',
  apiBaseUrl: '',
  iconUrl: '{BASE_URL}/apps/agents/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/agents/connection',
  primaryColor: '#4B5563',
  supportsConnections: false,
  actions,
  dynamicData,
});
