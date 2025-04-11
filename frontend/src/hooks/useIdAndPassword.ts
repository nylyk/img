const useIdAndPassword = (): [string, string] => {
  const id = location.pathname.split('/')[1];
  const password = location.hash.substring(1);
  return [id, password];
};

export default useIdAndPassword;
