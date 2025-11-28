import { useRef, useEffect } from "react";

/**
 * Custom hook to track previous value
 * Useful for comparing previous vs current state
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

