import React, { FC, use, useEffect, useMemo, useState } from 'react';
import Dropzone from './components/Dropzone';
import { MediaFile, Post } from '../../utils/post';
import { produce, nothing } from 'immer';
import useEncrypt from '../../hooks/useEncrypt';
import EditableMediaCard from './components/EditableMediaCard';
import UploadSection from './components/UploadSection';
import { Link } from 'wouter';
import useUpload from '../../hooks/useUpload';

const Index: FC = () => {
  const [post, setPost] = useState<Post>();
  const [state, error, cipherText, password] = useEncrypt(post);
  const [uploadProgress, id, uploadError, upload] = useUpload(3600, cipherText);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const url = useMemo(() => {
    if (id) {
      return `${location.origin}/${id}#${password}`;
    }
  }, [id]);

  useEffect(() => {
    setCopiedUrl(false);
  }, [post]);

  const onTitleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.target.style.height = '1px';
    event.target.style.height = `${event.target.scrollHeight}px`;
    setPost(
      produce((draft) => {
        if (draft) {
          draft.title = event.target.value;
        }
      })
    );
  };

  const onAddFile = (file: File) => {
    const newFile: MediaFile = {
      description: '',
      blob: file,
      url: URL.createObjectURL(file),
    };
    setPost(
      produce((draft) => {
        if (!draft) {
          return { title: '', files: [newFile] };
        }
        draft.files.push(newFile);
      })
    );
  };

  const onRemoveFile = (file: MediaFile) => {
    setPost(
      produce((draft) => {
        if (draft) {
          if (draft.files.length === 1) {
            return nothing;
          }
          draft.files = draft.files.filter((f) => f.url !== file.url);
        }
      })
    );
  };

  const onChangeFileDescription = (file: MediaFile, description: string) => {
    setPost(
      produce((draft) => {
        const toChange = draft?.files.find((f) => f.url === file.url);
        if (toChange) {
          toChange.description = description;
        }
      })
    );
  };

  const onCopyLink = () => {
    if (url) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="w-full sm:w-xl xl:w-2xl">
        {!post && (
          <div className="text-xl sm:text-2xl mt-3 sm:mt-4">
            Share images and videos privately!
          </div>
        )}
        {post && (
          <textarea
            rows={1}
            value={post.title}
            onChange={onTitleChange}
            className="w-full text-xl sm:text-2xl mt-3 sm:mt-4 outline-0 resize-none"
            placeholder="Give your post a title..."
          />
        )}
        {post &&
          post.files.map((file) => (
            <EditableMediaCard
              media={file}
              onRemove={onRemoveFile.bind(this, file)}
              onChangeDescription={onChangeFileDescription.bind(this, file)}
            />
          ))}
        <Dropzone compact={!!post} onAddFile={onAddFile} />
      </div>
      <div className="w-full sm:w-xl lg:w-[21rem] p-2 sm:p-3 border-t lg:border-t-0 lg:border-l border-zinc-300 dark:border-zinc-700">
        {post && !url && (
          <UploadSection
            state={state}
            progress={uploadProgress}
            error={error}
            onClick={upload}
          />
        )}
        {url && (
          <>
            <div className="w-full px-2 py-1 rounded-lg border inset-shadow-xs break-all bg-zinc-200/80 border-zinc-400/50 dark:bg-zinc-800 dark:border-zinc-700">
              <Link to={url}>{url}</Link>
            </div>
            <button
              className="w-full mt-3 p-3 rounded-lg cursor-pointer shadow hover:brightness-95 bg-blue-500 dark:bg-blue-500 text-white"
              onClick={onCopyLink}
            >
              {copiedUrl ? 'Copied!' : 'Copy Link'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
