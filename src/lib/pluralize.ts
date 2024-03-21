export const pluralize = (
  count: number,
  terms: { default: string; [key: number]: string }
) => {
  if (count in terms) return terms[count].replace("{count}", String(count));
  return terms.default.replace("{count}", String(count));
};
