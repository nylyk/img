import { useDocumentTitle } from '@uidotdev/usehooks';
import { api } from 'common';
import { nothing, produce } from 'immer';
import { LoaderCircle, TriangleAlert } from 'lucide-react';
import React, { FC, useState } from 'react';

import FullscreenMessage from '@/components/ui/FullscreenMessage';
import MediaCard from '@/components/ui/MediaCard';
import useFetch from '@/hooks/useFetch';
import { MediaFile, Post } from '@/utils/post';

import Dropzone from './components/Dropzone';
import History from './components/history/History';
import UploadControls from './components/uploadControls/UploadControls';

const Index: FC = () => {
  const [metadata, _, metadataError] =
    useFetch<api.PostMetadata>('/api/post/metadata');

  const [post, setPost] = useState<Post>();

  useDocumentTitle(
    post && post.title.length > 0
      ? `${post.title} - img`
      : 'Create upload - img',
  );

  const onTitleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.target.style.height = '1px';
    event.target.style.height = `${event.target.scrollHeight}px`;
    setPost(
      produce((draft) => {
        if (draft) {
          draft.title = event.target.value.substring(0, 100);
        }
      }),
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
      }),
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
      }),
    );
  };

  const onChangeFileDescription = (file: MediaFile, description: string) => {
    setPost(
      produce((draft) => {
        const toChange = draft?.files.find((f) => f.url === file.url);
        if (toChange) {
          toChange.description = description.substring(0, 700);
        }
      }),
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
          className="mt-3 w-full resize-none text-xl outline-0 sm:mt-4 sm:text-2xl"
          placeholder="Give your upload a title..."
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
        <div className="mt-3 text-xl sm:mt-4 sm:text-2xl">
          Share images and videos privately!
        </div>
        <Dropzone onAddFile={onAddFile} />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-5 lg:flex-row">
      <div className="w-full border-zinc-300 sm:w-xl lg:border-r lg:pr-5 xl:w-2xl dark:border-zinc-700/80">
        {body}
      </div>
      <div className="w-full sm:w-xl lg:mt-4 lg:w-[21rem]">
        {post && <UploadControls post={post} metadata={metadata} />}
        <History />
      </div>
    </div>
  );
};

export default Index;
