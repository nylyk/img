import { FC } from 'react';
import useIdAndPassword from '../hooks/useIdAndPassword';
import useFetchAndDecrypt from '../hooks/useFetchAndDecrypt';

const Viewer: FC = () => {
  const [id, password] = useIdAndPassword();
  const [state, error, post] = useFetchAndDecrypt(id, password);

  return (
    <>
      <h1>
        Viewer {id} {password}
      </h1>
      <span>{state}</span>
      {post &&
        post.images.map((image, i) => (
          <img src={image.dataUrl} key={i + image.dataUrl.slice(-10)} />
        ))}
    </>
  );
};

export default Viewer;
