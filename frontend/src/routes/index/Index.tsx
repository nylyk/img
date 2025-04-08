import { FC, useState } from 'react';
import Dropzone from './components/Dropzone';
import { Post } from '../../utils/post';
import { produce } from 'immer';
import useEncrypt from '../../hooks/useEncrypt';
import { api } from 'common';

const Index: FC = () => {
  const [post, setPost] = useState<Post>();

  const [state, error, cipherText, password] = useEncrypt(post);

  const [url, setUrl] = useState<string>();

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

  const onUpload = () => {
    fetch('/api/post', {
      method: 'POST',
      body: JSON.stringify({
        expiresInSeconds: 120,
        data: cipherText,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res: api.CreatePost) => {
        setUrl(`${location.origin}/${res.id}#${password}`);
      });
  };

  return (
    <>
      <span>{state}</span>
      {post &&
        post.images.map((image, i) => (
          <img src={image.dataUrl} key={i + image.dataUrl.slice(-10)} />
        ))}
      <Dropzone onAddDataUrl={onAddDataUrl} />
      <div className="p-3 bg-green-400 cursor-pointer" onClick={onUpload}>
        <h2>Upload</h2>
        <span>
          {typeof state === 'number' ? `${state / 1024 / 1024}MiB` : state}
        </span>
      </div>
      {url && <a href={url}>{url}</a>}
    </>
  );
};

export default Index;
