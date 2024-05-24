"use client";

import {
  type PropsWithChildren,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type TimerProviderProps = PropsWithChildren<{
  interval: number;
}>;

const TimerContext = createContext(0n);

export const useTimer = () => useContext(TimerContext);

export default function TimerProvider({
  children,
  interval,
}: TimerProviderProps): ReactNode {
  const [timer, setTimer] = useState(0n);

  useEffect(() => {
    const id = setInterval(() => setTimer((prev) => prev + 1n), interval);

    return () => {
      clearInterval(id);
    };
  }, [interval]);

  return (
    <TimerContext.Provider value={timer}>{children}</TimerContext.Provider>
  );
}
