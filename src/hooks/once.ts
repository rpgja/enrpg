import { type EffectCallback, useEffect, useRef } from "react";

export const useEffectOnce = (effect: EffectCallback): void => {
  const effected = useRef(false);

  useEffect(() => {
    if (effected.current) {
      return;
    }

    effected.current = true;

    return effect();
  }, [effect]);
};
