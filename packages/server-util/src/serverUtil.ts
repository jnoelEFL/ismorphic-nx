import { ServerResponse } from 'http';
import Logger from '@lss-isomorphic/logger';
import { AxiosService } from '@lss-isomorphic/axios';

export interface PageError {
  code?: string|number
  type?: string
  message?: string
  data?: Record<string, string>
}

export interface ComponentError {
  status?: string|number
  code?: string
  type?: string
  message?: string
}
export interface WithError<T> {
  error: T
}

export const error404 = (res: ServerResponse|undefined, type: string, obj: Record<string, string>): PageError => {
  if (res) res.statusCode = 404;
  return { code: 404, type, data: obj };
};

export const error500 = (res: ServerResponse|undefined, type: string, obj: Record<string, string>): PageError => {
  if (res) res.statusCode = 500;
  return { code: 500, type, data: obj };
};

export const componentError = (error: Error, component: string, logger: Logger): ComponentError => {
  const serviceError = AxiosService.getError(error);
  logger.error('component=%s error= %j', component, serviceError);
  return { status: serviceError.status, code: serviceError.code, message: serviceError.message };
};
