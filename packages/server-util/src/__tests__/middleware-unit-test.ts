import { basicCheckUrl, shoudlRewriteUrl } from '../middlewareUtil';

describe('middlewareUtil suite', () => {
  test('do not redirect http://efl.fr/gateway?page=1&aha=deux ', () => {
    const url = 'http://efl.fr/gateway?page=1&aha=deux';
    expect(basicCheckUrl(new URL(url)).originalUrl).toBe(url);
    expect(basicCheckUrl(new URL(url)).redirectUrl).toBeUndefined();
  });
  test('redirect http://efl.fr/gateway/ to http://efl.fr/gateway', () => {
    const url = 'http://efl.fr/gateway/';
    expect(basicCheckUrl(new URL(url)).redirectUrl).toBe('http://efl.fr/gateway');
  });
  test('redirect http://efl.fr/gaTeway?page=1&aha=deux to http://efl.fr/gateway?page=1&aha=deux', () => {
    const url = 'http://efl.fr/gaTeway?page=1&aha=deux';
    expect(basicCheckUrl(new URL(url)).originalUrl).toBe(url);
    expect(basicCheckUrl(new URL(url)).redirectUrl).toBe('http://efl.fr/gateway?page=1&aha=deux');
  });
  test('rewrite http://efl.fr/gateway?page=1&aha=deux to http://efl.fr/gateway?page=1', () => {
    const url = 'http://efl.fr/gateway?page=1&aha=deux';
    expect(shoudlRewriteUrl(new URL(url), ['page']).originalUrl).toBe(url);
    expect(shoudlRewriteUrl(new URL(url), ['page']).rewriteUrl).toBe('http://efl.fr/gateway?page=1');
  });
});
