export const escapeMetaChars = (input: string): string =>
  input.replaceAll(",", "[、]").replaceAll("#", "[#]");

export const unescapeMetaChars = (input: string): string =>
  input.replaceAll("[、]", ",").replaceAll("[#]", "#");
