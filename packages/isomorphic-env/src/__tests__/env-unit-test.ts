import { isNode, getGlobal, getLocalStorage, getSessionStorage } from '../env';

describe('isNode', () => {
  test('jest executes on node ', () => {
    expect(isNode()).toBeTruthy();
  });

  test('isGlobal node is global ', () => {
    expect(getGlobal()).toEqual(global);
  });

  test('localStorage is faked storage ', () => {
    const storage = getLocalStorage();
    expect(storage.getItem('key')).toEqual(null);
    expect(storage.setItem('key', 3)).toBeUndefined();
    expect(storage.removeItem('key')).toBeUndefined();
  });
  test('sessionStorage is faked storage ', () => {
    const storage = getSessionStorage();
    expect(storage.getItem('key')).toEqual(null);
    expect(storage.setItem('key', 3)).toBeUndefined();
    expect(storage.removeItem('key')).toBeUndefined();
  });
});
