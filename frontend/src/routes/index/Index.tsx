import React, { FC, useState } from 'react';
import Dropzone from './components/Dropzone';
import { MediaFile, Post } from '../../utils/post';
import { produce, nothing } from 'immer';
import MediaCard from '../../components/ui/MediaCard';
import UploadControls from './components/uploadControls/UploadControls';
import { useDocumentTitle } from '@uidotdev/usehooks';
import useFetch from '../../hooks/useFetch';
import { api } from 'common';
import FullscreenMessage from '../../components/ui/FullscreenMessage';
import { LoaderCircle, TriangleAlert } from 'lucide-react';
import History from './components/history/History';

const Index: FC = () => {
  const [metadata, _, metadataError] =
    useFetch<api.PostMetadata>('/api/post/metadata');

  const [post, setPost] = useState<Post>();

  useDocumentTitle(
    post && post.title.length > 0 ? `${post.title} - img` : 'Create post - img'
  );

  const onTitleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.target.style.height = '1px';
    event.target.style.height = `${event.target.scrollHeight}px`;
    setPost(
      produce((draft) => {
        if (draft) {
          draft.title = event.target.value.substring(0, 100);
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
          toChange.description = description.substring(0, 700);
        }
      })
    );
  };

  if (metadataError) {
    return (
      <FullscreenMessage>
        <TriangleAlert size={32} className="text-red-500 dark:text-red-400" />
        <span>Failed to load</span>
      </FullscreenMessage>
    );
  }

  if (!metadata) {
    return (
      <FullscreenMessage>
        <LoaderCircle size={26} className="animate-spin text-zinc-500" />
      </FullscreenMessage>
    );
  }

  let body;
  if (post) {
    body = (
      <>
        <textarea
          rows={1}
          value={post.title}
          onChange={onTitleChange}
          className="w-full text-xl sm:text-2xl mt-3 sm:mt-4 outline-0 resize-none"
          placeholder="Give your post a title..."
        />
        {post.files.map((file) => (
          <MediaCard
            media={file}
            onRemove={onRemoveFile.bind(this, file)}
            onChangeDescription={onChangeFileDescription.bind(this, file)}
            key={file.url}
          />
        ))}
        <Dropzone compact onAddFile={onAddFile} />
      </>
    );
  } else {
    body = (
      <>
        <div className="text-xl sm:text-2xl mt-3 sm:mt-4">
          Share images and videos privately!
        </div>
        <Dropzone onAddFile={onAddFile} />
      </>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      <div className="w-full sm:w-xl xl:w-2xl lg:pr-5 lg:border-r border-zinc-300 dark:border-zinc-700/80">
        {body}
      </div>
      <div className="w-full sm:w-xl lg:w-[21rem]">
        {post && <UploadControls post={post} metadata={metadata} />}
        <History />
      </div>
    </div>
  );
};

export default Index;
