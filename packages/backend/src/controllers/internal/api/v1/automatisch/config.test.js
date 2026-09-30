import { describe, expect, it, vi } from 'vitest';
import request from 'supertest';

import app from '../../../../../app.js';
import appConfig from '@/config/app.js';
import { updateConfig } from '@/factories/config.js';
import configMock from '@/mocks/rest/internal/api/v1/automatisch/config.js';

describe('GET /internal/api/v1/automatisch/config', () => {
  it('returns persisted config merged with static app settings', async () => {
    vi.spyOn(appConfig, 'disableNotificationsPage', 'get').mockReturnValue(
      true
    );
    vi.spyOn(appConfig, 'disableFavicon', 'get').mockReturnValue(true);
    vi.spyOn(appConfig, 'additionalDrawerLink', 'get').mockReturnValue(
      'https://example.com/extra'
    );
    vi.spyOn(appConfig, 'additionalDrawerLinkIcon', 'get').mockReturnValue(
      'link'
    );
    vi.spyOn(appConfig, 'additionalDrawerLinkText', 'get').mockReturnValue(
      'Extra'
    );

    const savedConfig = await updateConfig({
      logoSvgData: '<svg id="logo"></svg>',
      palettePrimaryDark: '#111111',
      palettePrimaryLight: '#eeeeee',
      palettePrimaryMain: '#3366ff',
      title: 'CE Instance',
    });

    const response = await request(app)
      .get('/internal/api/v1/automatisch/config')
      .expect(200);

    expect(response.body).toStrictEqual(
      configMock({
        ...savedConfig,
        disableNotificationsPage: true,
        disableFavicon: true,
        additionalDrawerLink: 'https://example.com/extra',
        additionalDrawerLinkIcon: 'link',
        additionalDrawerLinkText: 'Extra',
      })
    );
  });
});
