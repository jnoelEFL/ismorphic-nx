import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Logger from '@lss-isomorphic/logger';

const DEFAULT_HEADERS: Record<string, string> = {};

const X_TRACE_ID = '';
const X_ERROR_ID = '';

/*
  Add dynamic configuration loading interceptors as well as tracing header X-xx-yy-zz info

  options:
     configLoader : either axios config object once for all or a function
                    to load the config at each request (neat and required with storybook)
     headers: configHeaders = DEFAULT_HEADERS,
     interceptors: request and response interceptors when provided
*/
export type ConfigLoader = () => AxiosRequestConfig
type AxiosConfInterceptor = (
  value: AxiosRequestConfig
) => AxiosRequestConfig | Promise<AxiosRequestConfig>
type AxiosErrorInterceptor = (error: unknown) => unknown | undefined
type AxiosResponseInterceptor = (
  value: AxiosResponse
) => AxiosResponse | Promise<AxiosResponse> | undefined

export interface RequestInterceptor {
  confInterceptor: AxiosConfInterceptor
  errorInterceptor: AxiosErrorInterceptor
}

export interface ResponseInterceptor {
  responseInterceptor: AxiosResponseInterceptor | undefined
  errorInterceptor: AxiosErrorInterceptor
}

export interface AxiosInterceptors {
  request?: RequestInterceptor
  response?: ResponseInterceptor
}

export interface AxiosServiceOptions {
  configLoader?: ConfigLoader
  config?: AxiosRequestConfig
  headers?: Record<string, string>
  interceptors?: AxiosInterceptors
  logger: Logger
}

export const cleanUrl = (url?: string): string => {
  let result = url ?? '';
  while (result[result.length - 1] === '/') {
    result = result.slice(0, result.length - 1);
  }
  return result;
};

class AxiosBuilder {
  configLoader: ConfigLoader| undefined;
  logger: Logger | undefined;
  axiosInstance!: AxiosInstance;

  static hotMergeConfig (
    currentConfig: AxiosRequestConfig,
    newConfig: AxiosRequestConfig
  ): AxiosRequestConfig {
    const { url = '', headers: newHeaders = {} } = newConfig;
    const { baseURL, headers: currentHeaders, ...rest } = currentConfig;
    return {
      baseURL: url || baseURL,
      headers: { ...currentHeaders, ...newHeaders },
      ...rest
    };
  }

  static cleanUrl (url: string): string {
    return cleanUrl(url);
  }

  /**
   *
   * @param {*} options
   */
  constructor (options: AxiosServiceOptions) {
    this.createAxiosInstance(options);
  }

  setConfigLoader (configLoader: ConfigLoader | undefined): void {
    this.configLoader = configLoader;
  }

  /**
   *
   * @param options
   */
  createAxiosInstance (options: AxiosServiceOptions): void {
    const {
      configLoader,
      config: configDefault,
      headers: configHeaders = DEFAULT_HEADERS,
      interceptors: {
        request: { confInterceptor = undefined } = {},
        response: { errorInterceptor = undefined } = {}
      } = {},
      logger
    } = options || {};

    this.configLoader =
      typeof configLoader === 'function' ? configLoader : undefined;

    const config: AxiosRequestConfig =
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      (this.configLoader ? this.configLoader() : configDefault) || {};

    const { url = '', headers, ...others } = config;
    const defaultHeaders: Record<string, string> = {
      ...configHeaders,
      ...(headers as Record<string, string>)
    };
    this.logger = logger;
    this.axiosInstance = axios.create({
      baseURL: cleanUrl(url),
      headers: defaultHeaders,
      ...others
    });

    this.manageInterceptors(confInterceptor, errorInterceptor);
  }

  manageInterceptors (
    confInterceptor: AxiosConfInterceptor | undefined,
    errorInterceptor: AxiosErrorInterceptor | undefined
  ): void {
    if (!this.axiosInstance) return;

    // request interceptor (typically refresh token)
    if (typeof this.configLoader === 'function' || confInterceptor) {
      const requestInterceptor = this.buildRequestInterceptor(confInterceptor);
      this.axiosInstance.interceptors.request.use(
        conf => requestInterceptor(conf),
        error => Promise.reject(error)
      );
    }

    // error interceptor
    this.axiosInstance.interceptors.response.use(
      response => {
        if (this.logger) {
          const { headers: reqheaders = {} } = response || {};
          this.logger.setMetadata(X_TRACE_ID, reqheaders[X_TRACE_ID]);
        }
        return response;
      },
      error => {
        // eslint-disable-next-line no-param-reassign
        const { headers: resheaders = {} } = error?.response || {};
        // eslint-disable-next-line no-param-reassign
        error.errorId = X_ERROR_ID && resheaders ? resheaders[X_ERROR_ID] : '';
        // eslint-disable-next-line no-param-reassign
        error.traceId = X_TRACE_ID && resheaders ? resheaders[X_TRACE_ID] : '';
        if (errorInterceptor) {
          return errorInterceptor(error);
        }
        return Promise.reject(error);
      }
    );
  }

  buildRequestInterceptor (
    interceptor?: AxiosConfInterceptor
  ): AxiosConfInterceptor {
    return async (currentConfig: AxiosRequestConfig) => {
      // reset logger metadata x-traceid
      if (X_TRACE_ID && this.logger) {
        this.logger.setMetadata(X_TRACE_ID, '');
      }

      const config = this.configLoader
        ? AxiosBuilder.hotMergeConfig(currentConfig, this.configLoader())
        : currentConfig;

      if (interceptor) {
        return await interceptor(config);
      }
      return config;
    };
  }

  getAxiosInstance (): AxiosInstance {
    return this.axiosInstance;
  }
}

export default AxiosBuilder;
