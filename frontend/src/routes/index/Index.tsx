import { FC, useState } from 'react';
import Dropzone from './components/Dropzone';
import { Post } from '../../utils/post';
import { produce } from 'immer';
import useEncrypt from '../../hooks/useEncrypt';
import { api } from 'common';

const Index: FC = () => {
  const [post, setPost] = useState<Post>();

  const [state, error, cipherText, password] = useEncrypt(post);

  const [postUrl, setPostUrl] = useState<string>();

  const onAddFile = (file: File) => {
    if (file.type.startsWith('image')) {
      const newFile = {
        description: '',
        blob: file,
        objectUrl: URL.createObjectURL(file),
      };
      setPost(
        produce((draft) => {
          if (!draft) {
            return { title: 'New post', files: [newFile] };
          }
          draft.files.push(newFile);
        })
      );
    }
  };

  const onUpload = () => {
    fetch('/api/post', {
      method: 'POST',
      body: JSON.stringify({
        expiresInSeconds: 3600,
        data: cipherText,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res: api.CreatePost) => {
        setPostUrl(`${location.origin}/${res.id}#${password}`);
      });
  };

  return (
    <>
      <span>{state}</span>
      {post &&
        post.files.map((file) => {
          if (file.blob.type.startsWith('image')) {
            return <img src={file.objectUrl} key={file.objectUrl} />;
          }
        })}
      <Dropzone onAddFile={onAddFile} />
      <div className="p-3 bg-green-400 cursor-pointer" onClick={onUpload}>
        <h2>Upload</h2>
        <span>
          {typeof state === 'number' ? `${state / 1024 / 1024}MiB` : state}
        </span>
      </div>
      {postUrl && <a href={postUrl}>{postUrl}</a>}
    </>
  );
};

export default Index;
