import { cleanUrl as axiosCleanUrl } from '@lss-isomorphic/axios';

// used on server to bypass webpack (server)
export const getEnvValue = (key: string): string | undefined => {
  return process.env[key];
};

export const cleanUrl = (url?: string): string => {
  return axiosCleanUrl(url);
};
