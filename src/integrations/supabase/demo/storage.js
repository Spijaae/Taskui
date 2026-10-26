// Demo storage buckets. Files are kept as data URLs in localStorage
// (images are downscaled first so a few dozen photos fit comfortably).

import { getMeta, setMeta } from "./store";

const MAX_IMAGE_EDGE = 1280;

function readAsDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function shrinkImage(file) {
  const url = await readAsDataUrl(file);
  if (!file.type?.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") return url;
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = url;
    });
    const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } catch {
    return url;
  }
}

function files() {
  return getMeta("files") ?? {};
}

export function createStorage() {
  return {
    from(bucket) {
      const key = (path) => `${bucket}/${path}`;
      return {
        async upload(path, file) {
          try {
            const dataUrl = await shrinkImage(file);
            const all = files();
            all[key(path)] = dataUrl;
            setMeta("files", all);
            return { data: { path, id: key(path), fullPath: key(path) }, error: null };
          } catch (error) {
            return { data: null, error: { message: error?.message ?? "Upload failed (storage is full?)" } };
          }
        },
        getPublicUrl(path) {
          return { data: { publicUrl: files()[key(path)] ?? "" } };
        },
        async createSignedUrl(path) {
          const url = files()[key(path)];
          if (!url) return { data: null, error: { message: "Object not found" } };
          return { data: { signedUrl: url }, error: null };
        },
        async remove(paths) {
          const all = files();
          for (const path of paths) delete all[key(path)];
          setMeta("files", all);
          return { data: paths.map((name) => ({ name })), error: null };
        },
        async download(path) {
          const url = files()[key(path)];
          if (!url) return { data: null, error: { message: "Object not found" } };
          return { data: await (await fetch(url)).blob(), error: null };
        },
      };
    },
  };
}
