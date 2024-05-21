export const mapGetOrInit = <K, V>(map: Map<K, V>, key: K, initialValue: V): V => {
  const value = map.get(key) ?? initialValue;

  if (!map.has(key)) {
    map.set(key, value);
  }

  return value;
};
