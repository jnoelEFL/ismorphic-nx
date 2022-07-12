/**
 * return true in node environment false if not
 */
export const isNode = (): boolean => typeof window === 'undefined' || typeof global.process === 'object';

export const getGlobal = (): (object & { document?: Document }) | Window => (isNode() ? (global as object) : window);
export const getGlobalDocument = (): unknown => getGlobal().document;

const fakeStorage: Storage = {
  length: 0,
  key: (): null => null,
  getItem: () => null,
  setItem: () => {
    // This is intentional
  },
  removeItem: () => {
    // This is intentional
  },
  clear: () => {
    // This is intentional
  }
};
export const getLocalStorage = (): Storage => (isNode() ? fakeStorage : window.localStorage);
export const getSessionStorage = (): Storage => (isNode() ? fakeStorage : window.sessionStorage);
