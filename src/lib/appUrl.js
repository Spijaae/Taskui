// The standalone build is opened straight from disk (file://), where there is
// no server to answer deep links, so routing moves into the URL hash.
export const isFileProtocol = typeof window !== "undefined" && window.location.protocol === "file:";

export function appUrl(path) {
  if (isFileProtocol) return `${window.location.href.split("#")[0]}#${path}`;
  return `${window.location.origin}${path}`;
}
