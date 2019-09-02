import reactServerSideRender from '../reactServerSideRender';

describe('reactServerSideRender', () => {
  it('should build html string from configuration', () => {
    const mockData = require('../__mocks__/configData').default;
    const html = reactServerSideRender(mockData);

    expect(html).toContain('<meta name="title" content="Lambchop - 2019" />');
    expect(html).toContain('<meta name="description" content="This is demo app for lambchop." />');
    expect(html).toContain('<script src="http://localhost:8080/test/assets/testBrowser.js" defer="true" />');
    expect(html).toContain('window[\'SSR_BRIDGE_DATA\'] = {"value":"test"}');
    expect(html).toContain('window.ENV_FROM_SERVER = {"env":"test"}');
    expect(html).toContain('dataLayer = [{"data_layer":"test"}]');
    expect(html).toContain('<style src=""custom_header" />');
    expect(html).toContain('<style src=""custom_body" />');
    expect(html).toContain('_rollbarConfig');
    expect(html).toContain('<!-- Google Tag Manager -->');
    expect(html).toContain('<!-- Analytics-Optimize Snippet -->');
    expect(html).toContain('This is test!');
  });

  it('should build html string from configuration without ga and gtm', () => {
    const mockData = require('../__mocks__/configData').default;
    delete mockData.gaConfig;
    const html = reactServerSideRender(mockData);
    expect(html.includes('<!-- Google Tag Manager -->')).toEqual(false);
    expect(html.includes('<!-- Analytics-Optimize Snippet -->')).toEqual(false);
  });

  it('should build html string from configuration with initialStateEndpoint polling', () => {
    const mockData = require('../__mocks__/configData').default;
    mockData.initialStateEndpoint = 'http://initialStateEndpoint';
    delete mockData.initialStateData;
    const html = reactServerSideRender(mockData);
    expect(html).toContain('xhr.open(\'GET\', \'http://initialStateEndpoint\')');
  });
});
