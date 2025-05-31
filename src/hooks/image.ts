import { loadImage } from "@/utils/image";
import { useEffect, useState } from "react";

export const useImage = (src: string): HTMLImageElement | undefined => {
  const [image, setImage] = useState<HTMLImageElement>();

  useEffect(() => {
    loadImage(src).then(setImage);
  }, [src]);

  return image;
};
