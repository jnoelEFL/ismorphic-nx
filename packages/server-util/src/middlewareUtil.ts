import { Request, Response } from 'express';
import { cleanUrl } from './envUtil';

type NextFunction = () => void;

export interface URLRewrite {
  originalUrl?: string
  rewriteUrl?: string
}

export interface URLRedirect {
  originalUrl?: string
  redirectUrl?: string
}

export const fullUrl = (req: Request): string => {
  if (!req) return '';
  const host = req.headers.host ?? req.hostname;
  const { originalUrl } = req;
  if (`${process.env['LOCAL']}` === 'http') {
    // local
    return `http://${host}${originalUrl}`;
  }
  return `https://${host}${originalUrl}`;
};

/**
 *
 * @param url Nextjs allow to rewrite URL
 * @param allowedParams
 * @returns
 */
export const shoudlRewriteUrl = (url: URL | undefined, allowedParams: string[]): URLRewrite => {
  if (!(url instanceof URL) || !Array.isArray(allowedParams)) {
    return {};
  }
  const result: URLRewrite = { originalUrl: url.toString() };
  let rewrite = false;
  url.searchParams.forEach((_, key) => {
    if (!allowedParams.includes(key)) {
      url.searchParams.delete(key);
      rewrite = true;
    }
  });
  if (rewrite) {
    result.rewriteUrl = url.toString();
  }

  return result;
};

const pathnameCheck = (pathname?: string): string => {
  if (!pathname || pathname === '/') return '/';
  return cleanUrl(pathname).toLowerCase();
};

export const basicCheckUrl = (url: URL | undefined): URLRedirect => {
  if (!(url instanceof URL)) {
    return {};
  }

  const result: URLRedirect = { originalUrl: url?.href };

  // basic redirect
  const lowerpathname = pathnameCheck(url?.pathname);

  if (url.pathname !== lowerpathname) {
    url.pathname = lowerpathname;
    result.redirectUrl = url.toString();
    return result;
  }

  return result;
};

export const basicCheckMiddleware = (req: Request, resp: Response, next: NextFunction): void => {
  const urlCheck = basicCheckUrl(new URL(fullUrl(req)));
  if (urlCheck.redirectUrl) {
    resp.redirect(301, urlCheck.redirectUrl);
    return;
  }
  next();
};
