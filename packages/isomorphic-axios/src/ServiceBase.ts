import Logger from '@lss-isomorphic/logger';
import { AxiosInstance } from 'axios';

interface ServiceBase {
  getAxiosInstance: () => AxiosInstance
  getConfig: () => Record<string, string|undefined>
  getLogger: () => Logger
}

export default ServiceBase;
