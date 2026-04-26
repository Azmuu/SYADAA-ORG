/**
 * Build a URL to an asset in Vite's `public/` folder.
 * Use for paths that include spaces or other reserved characters.
 */
export function publicFolderFile(folder, filename) {
  return `/${encodeURIComponent(folder)}/${encodeURIComponent(filename)}`;
}
