/**
 * make image path
 * @param id
 * @param format
 * @returns image path
 */
export function makeImagePath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}
