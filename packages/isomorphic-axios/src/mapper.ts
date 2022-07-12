import { snakeCase } from 'snake-case';
import { camelCase } from 'camel-case';
import deepMapKeys from 'deep-map-keys';

function mapPropsToApi<T> (args: unknown): T {
  return deepMapKeys(args, snakeCase);
}

function mapApiToProps<T> (args: unknown): T {
  return deepMapKeys(args, camelCase);
}

export { mapPropsToApi, mapApiToProps, snakeCase, camelCase };
