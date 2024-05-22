// NOTE: Possible memory leak
const cache = new Map<string, HTMLImageElement>();

export const getImage = (src: string): HTMLImageElement | undefined => cache.get(src);

export const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
  const cached = cache.get(src);

  if (cached) {
    resolve(cached);

    return;
  }

  const img = document.createElement("img");
  const cleanUp = () => {
    img.onload = img.onerror = null;
  };

  img.onload = () => {
    cleanUp();
    cache.set(src, img);
    resolve(img);
  };

  img.onerror = error => {
    cleanUp();
    reject(error);
  }

  img.src = src;
});
