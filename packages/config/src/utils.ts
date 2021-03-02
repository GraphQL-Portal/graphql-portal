export const deepSearch = (
  object: { [key: string]: any },
  key: string,
  predicate: (k: string, v: any) => boolean
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
