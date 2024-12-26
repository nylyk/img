import { FC } from 'react';
import useIdAndPassword from '../hooks/useIdAndPassword';

const Viewer: FC = () => {
  const [id, password] = useIdAndPassword();

  return (
    <h1>
      Viewer {id} {password}
    </h1>
  );
};

export default Viewer;
