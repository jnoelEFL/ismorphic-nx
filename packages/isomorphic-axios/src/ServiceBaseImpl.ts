import Logger from '@lss-isomorphic/logger';
import { AxiosInstance } from 'axios';
import { AxiosService } from './AxiosService';
import ServiceBase from './ServiceBase';

/**
 * Provide an isomorphic service pattern by injecting either a browser implementation or a server side implementation.
 */

class ServiceBaseImpl implements ServiceBase {
  envConfig: Record<string, string | undefined>;
  implem: AxiosService;
  logger: Logger;

  constructor (implem: AxiosService, envConfig: Record<string, string|undefined>, logger: Logger) {
    this.implem = implem;
    this.envConfig = envConfig;
    this.logger = logger;
  }

  getAxiosInstance (): AxiosInstance {
    return this.implem.getAxiosInstance();
  }

  getConfig (): Record<string, string|undefined> {
    return this.envConfig;
  }

  getLogger (): Logger {
    return this.logger;
  }
}

export default ServiceBaseImpl;
