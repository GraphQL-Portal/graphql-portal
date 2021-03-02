/**
 * Using for matching extra conditions
 *
 * @callback predicateCallback
 * @param {string} key - Target key
 * @param {*} value - Target value
 * @return {boolean} - Boolean, true if key and value it's matches conditions
 */

/**
 * Returns and object property according to key and predicate function.
 *
 * @param {string} key - Targret key
 * @param {Object} object - Target object
 * @param {predicateCallback} predicate - The callback that contains any extra conditions.
 * @return {*} - Requested value
 *
 * @example
 *
 *     deepSearch({somekey: 'somevalue'}, 'somekey', (k, v) => (v === 'somevalue'))
 */
export const deepSearch = (
  object: { [key: string]: any },
  key: string,
  predicate: (key: string, value: any) => boolean
): any => {
  if (object[key] && predicate(key, object[key])) return object[key];

  const keys = Object.keys(object);
  for (let i = 0; i < keys.length; i++) {
    const value = object[keys[i]];
    if (value && typeof value === 'object') {
      const result = deepSearch(value, key, predicate);
      if (result !== null) return result;
    }
  }
  return null;
};
