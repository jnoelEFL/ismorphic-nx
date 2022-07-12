const numberValue = (param: string | undefined): number | undefined => {
  if (typeof param === 'undefined') {
    return undefined;
  }
  const nbValue = Number(param);
  return Number.isNaN(nbValue) ? undefined : nbValue;
};

export interface Query {
  [key: string]: string | string[] | undefined
}

export const getSingleParams = (
  query: Query,
  params: string[],
  asNumber = false
): Record<string, string | number | undefined> => {
  return (params || []).reduce((agg, item) => {
    const routerValue = query[item];
    const value: string | undefined = Array.isArray(routerValue) ? routerValue[0] : routerValue;
    return { ...agg, [item]: asNumber ? numberValue(value) : value };
  }, {});
};

export const queryAsString = (query: Query, param: string): string => (query[param] as string);
