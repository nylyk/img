import { useEffect, useState } from 'react';

const useFetch = <T>(url: string): [T | undefined, boolean] => {
  const [data, setData] = useState<T>();
  const [error, setError] = useState(false);

  useEffect(() => {
    setData(undefined);
    setError(false);

    let ignore = false;

    fetch(url)
      .then((res) => {
        if (!ignore) {
          if (res.status !== 200) {
            return setError(true);
          }
          return res.json();
        }
      })
      .then((res) => {
        if (!ignore) {
          setData(res);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(true);
          console.log(err);
        }
      });

    return () => {
      ignore = true;
    };
  }, [url]);

  return [data, error];
};

export default useFetch;
