import axios, { AxiosError, AxiosInstance } from 'axios';
import { Response } from 'express';
import Logger from '@lss-isomorphic/logger';
import AxiosBuilder, { AxiosServiceOptions, ConfigLoader } from './AxiosBuilder';

export interface ServiceError {
  [index: string]: unknown
  status?: number
  code?: string
  message?: string
  headers?: Record<string, unknown>
}

interface ResponseData {
  [index: string]: unknown
  status?: number
  code?: string
  message?: string
  headers?: Record<string, unknown>
}
export class AxiosService {
  builder: AxiosBuilder;
  configLoader: ConfigLoader | undefined;
  options: AxiosServiceOptions;
  logger: Logger;
  envConfig: Record<string, string | undefined>;
  static buildError (error: Error | AxiosError, truncateData = 100): ServiceError {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error;
      if (axiosError.response) {
        const response = axiosError.response;
        const { data = {}, headers, config } = response;
        const result: ServiceError = { headers, config };
        const rdata = typeof data === 'string' ? { message: data } : data as ResponseData;
        const status = rdata.status ?? response.status;
        const code = rdata.code ?? response.statusText;
        const message = rdata.message ?? axiosError.message;
        if (status) result.status = status;
        if (code) result.code = code;
        if (message) {
          result.message =
            truncateData > 0 && message.length > truncateData ? `${message.substring(0, truncateData)}...` : message;
        }
        return result;
      }
      if (axiosError.request) {
        const result: ServiceError = { status: 504, config: axiosError.config };
        if (axiosError.message) result.message = axiosError.message;
        return result;
      }
    }
    return { message: error.message };
  }

  static getError (error: Error | AxiosError): ServiceError {
    return Logger.jsonable(AxiosService.buildError(error)) as ServiceError;
  }

  static sendError (error: Error | AxiosError, res: Response): void {
    const serviceError = AxiosService.getError(error);
    res.status(serviceError.status ?? 500).send(serviceError);
  }

  constructor (options: AxiosServiceOptions, envConfig?: Record<string, string | undefined>) {
    this.builder = new AxiosBuilder(options);
    this.options = options;
    this.logger = options?.logger;
    this.envConfig = envConfig ?? {};
  }

  getAxiosInstance (): AxiosInstance {
    return this.builder.axiosInstance;
  }

  getConfig (): Record<string, string | undefined> {
    return this.envConfig;
  }

  getLogger (): Logger {
    return this.logger;
  }

  resetAxiosInstance (): AxiosInstance {
    this.builder = new AxiosBuilder(this.options);
    this.builder.setConfigLoader(this.configLoader);
    return this.getAxiosInstance();
  }

  setConfigLoader (configLoader: ConfigLoader): void {
    this.builder.setConfigLoader(configLoader);
    this.configLoader = configLoader;
  }
}
