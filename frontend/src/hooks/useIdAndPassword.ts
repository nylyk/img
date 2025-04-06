import { useLocation } from 'react-router';

const useIdAndPassword = (): [string, string] => {
  const location = useLocation();
  const id = location.pathname.split('/')[1];
  const password = location.hash.substring(1);
  return [id, password];
};

export default useIdAndPassword;
