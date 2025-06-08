import { DependencyList, useCallback, useEffect, useState } from 'react';

const useIntervalState = <T>(
  intervalMs: number,
  handler: () => T,
  deps: DependencyList = [],
): T => {
  const [state, setState] = useState<T>(handler());

  const _handler = useCallback(handler, deps);

  useEffect(() => {
    setState(_handler());
    const interval = setInterval(() => {
      setState(_handler());
    }, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs, _handler]);

  return state;
};

export default useIntervalState;
