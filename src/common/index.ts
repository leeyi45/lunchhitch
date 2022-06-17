/**
 * Some functions may return a regular value or a Promise. Use this function to wrap the result of such a function as a Promise
 * @param result Result to wrap
 * @returns Promise that resolves to the result
 */
export function wrapIntoPromise<T>(result: (T | Promise<T>)) {
  return result instanceof Promise ? result : Promise.resolve(result);
}

export type KeysOfType<T, K = any> = { [P in keyof T]: T[P] extends K ? P : never }[keyof T];
