import PQueue from "p-queue";

// NOTE: Possible memory leak
const cache = new Map<string, HTMLImageElement | Promise<HTMLImageElement>>();

const failedSources = new Set<string>();

/**
 * If the image is cached, it returns the cached image, otherwise it requests the image and returns undefined.
 */
export const requestImage = (src: string): HTMLImageElement | undefined => {
  if (failedSources.has(src)) {
    return;
  }

  const cached = cache.get(src);

  if (cached instanceof HTMLImageElement) {
    return cached;
  }

  if (cached instanceof Promise) {
    return;
  }

  loadImage(src);
};

const queue = new PQueue({
  concurrency: 1,
  interval: 0,
  intervalCap: 1,
  autoStart: true,
});

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  const cached = cache.get(src);

  if (cached instanceof HTMLImageElement) {
    return Promise.resolve(cached);
  }

  if (cached instanceof Promise) {
    return cached;
  }

  const resolvers = Promise.withResolvers<HTMLImageElement>();

  cache.set(src, resolvers.promise);

  queue.add(
    () =>
      new Promise((resolve, reject) => {
        const img = document.createElement("img");
        const cleanUp = () => {
          img.onload = img.onerror = null;
        };

        img.onload = () => {
          cleanUp();
          cache.set(src, img);
          resolvers.resolve(img);
          resolve(img);
        };
        img.onerror = (event) => {
          cleanUp();
          failedSources.add(src);
          resolvers.reject(event);
          reject(event);
        };
        img.src = src;
      }),
  );

  return resolvers.promise;
};
