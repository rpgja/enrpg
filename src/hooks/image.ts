import { loadImage } from "@/utils/image";
import { useEffect, useState } from "react";

export const useImage = (...args: Parameters<typeof loadImage>): HTMLImageElement | undefined => {
  const [image, setImage] = useState<HTMLImageElement>();

  useEffect(() => {
    loadImage(...args).then(setImage)
  }, []);

  return image;
};
