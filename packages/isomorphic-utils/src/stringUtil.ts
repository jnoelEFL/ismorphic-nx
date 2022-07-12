import lodashTruncate from 'lodash.truncate';

const clean = (values: string[]): string[] => (values ?? []).map(s => s.trim()).filter(s => s);

export const mergeMultivaluedString = (values: string[], previous?: string, separator = ' '): string => {
  const oldValues = clean((previous ? previous.split(separator) : []));

  return Array.from(new Set([...clean(values), ...oldValues])).join(separator);
};

export const truncate = (str: string, maxLength: number, options?: { separator?: RegExp, omission?: string}): string => {
  return lodashTruncate(str, { ...options, length: maxLength });
};

export const truncateSeoDescription = (title = ''): string => {
  return truncate(title, 340, { separator: /,? +/, omission: '...' });
};

export const truncateOpenGraphDescription = (title = ''): string => {
  return truncate(title, 297, { separator: /,? +/, omission: '' });
};

export const truncateTwitterDescription = (title = ''): string => {
  return truncate(title, 280, { separator: /,? +/, omission: '' });
};
