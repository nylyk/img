import { FC, useEffect, useState } from 'react';
import Dropzone from './components/Dropzone';
import { Post } from '../../utils/post';
import { produce } from 'immer';
import useEncryption from '../../hooks/useEncryption';

const Index: FC = () => {
  const [post, setPost] = useState<Post>();

  const [state, error, password, cipherText] = useEncryption(post);

  const onAddDataUrl = (dataUrl: string) => {
    setPost(
      produce((draft) => {
        if (!draft) {
          return { title: 'New post', images: [{ dataUrl, description: '' }] };
        }
        draft.images.push({ dataUrl, description: '' });
      })
    );
  };

  return (
    <>
      <span>{state}</span>
      {post &&
        post.images.map((image, i) => (
          <img src={image.dataUrl} key={i + image.dataUrl.slice(-10)} />
        ))}
      <Dropzone onAddDataUrl={onAddDataUrl} />
    </>
  );
};

export default Index;
