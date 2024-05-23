// NOTE: Possible memory leak
const cache = new Map<string, HTMLImageElement | Promise<HTMLImageElement>>();

/**
 * If the image is cached, it returns the cached image, otherwise it requests the image and returns undefined.
 */
export const requestImage = (src: string): HTMLImageElement | undefined => {
  const cached = cache.get(src);

  if (cached instanceof HTMLImageElement) {
    return cached;
  }

  if (cached instanceof Promise) {
    return;
  }

  loadImage(src);
};

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  const cached = cache.get(src);

  if (cached instanceof HTMLImageElement) {
    return Promise.resolve(cached);
  }

  if (cached instanceof Promise) {
    return cached.then();
  }

  const { resolve, reject, promise } =
    Promise.withResolvers<HTMLImageElement>();

  cache.set(src, promise);

  const img = document.createElement("img");
  const cleanUp = () => {
    img.onload = img.onerror = null;
  };

  img.onload = () => {
    cleanUp();
    cache.set(src, img);
    resolve(img);
  };
  img.onerror = (event) => {
    cleanUp();
    cache.delete(src);
    reject(event);
  };
  img.src = src;

  return promise;
};
