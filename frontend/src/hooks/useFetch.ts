import { useEffect, useState } from 'react';

const useFetch = <T>(
  url: string,
): [T | undefined, number | undefined, boolean] => {
  const [data, setData] = useState<T>();
  const [status, setStatus] = useState<number>();
  const [error, setError] = useState(false);

  useEffect(() => {
    setData(undefined);
    setStatus(undefined);
    setError(false);

    let ignore = false;

    (async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();

        if (!ignore) {
          setData(data);
          setStatus(response.status);
          if (response.status != 200) {
            setError(true);
          }
        }
      } catch (error) {
        if (!ignore) {
          console.error(error);
          setError(true);
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, [url]);

  return [data, status, error];
};

export default useFetch;
