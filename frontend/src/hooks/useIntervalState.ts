import { DependencyList, useEffect, useState } from 'react';

const useIntervalState = <T>(
  intervalMs: number,
  handler: () => T,
  deps: DependencyList = []
): T => {
  const [state, setState] = useState<T>(handler());

  useEffect(() => {
    setState(handler());
    const interval = setInterval(() => {
      setState(handler());
    }, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs, handler, ...deps]);

  return state;
};

export default useIntervalState;
