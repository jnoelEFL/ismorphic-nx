import { mergeMultivaluedString, truncate } from '../stringUtil';

describe('stringUtil suite', () => {
  test('merge multi values with no previous', () => {
    expect(mergeMultivaluedString(['a', 'b'])).toBe('a b');
  });
  test('merge multi values remove doubles', () => {
    expect(mergeMultivaluedString(['a', 'b'], 'a c')).toBe('a b c');
  });
  test('merge multi values remove multiple spaces', () => {
    expect(mergeMultivaluedString(['a ', ' b'], 'a  c')).toBe('a b c');
  });
  test('merge multi values with ; separator', () => {
    expect(mergeMultivaluedString(['a', 'b'], 'a;c', ';')).toBe('a;b;c');
  });
  test('truncate "hi-diddly-ho there, neighborino" to 24 default to "hi-diddly-ho there, n..."', () => {
    expect(truncate('hi-diddly-ho there, neighborino', 24)).toBe('hi-diddly-ho there, n...');
  });
  test('truncate "hi-diddly-ho there, neighborino" to 24 with blank separator to "hi-diddly-ho there,..."', () => {
    expect(truncate('hi-diddly-ho there, neighborino', 24, { separator: / / })).toBe('hi-diddly-ho there,...');
  });
  test('truncate "hi-diddly-ho there, neighborino" to 24 with separator/,? / to "hi-diddly-ho there..."', () => {
    expect(truncate('hi-diddly-ho there, neighborino', 24, { separator: /,? / })).toBe('hi-diddly-ho there...');
  });
  test('truncate "hi-diddly-ho there, neighborino" to 24 with blank separator and without ellipsis to "hi-diddly-ho there,"', () => {
    expect(truncate('hi-diddly-ho there, neighborino', 24, { separator: / /, omission: '' })).toBe('hi-diddly-ho there,');
  });
});
