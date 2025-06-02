import { FC, useMemo, useState } from 'react';
import useEncrypt, { EncryptionState } from '../../../hooks/useEncrypt';
import { formatSize } from '../../../utils/utils';
import { Post } from '../../../utils/post';
import useUpload from '../../../hooks/useUpload';
import UploadButton from './UploadButton';
import CopyableLink from './CopyableLink';
import ExpirationTimeSelector from './ExpirationTimeSelector';
import { api } from 'common';

const makeLoadingText = (state: EncryptionState): string => {
  switch (state) {
    case 'serialization':
      return 'Serializing';
    case 'encryption':
      return 'Encrypting';
    default:
      return 'Waiting';
  }
};

const UploadControls: FC<{
  post: Post;
  metadata: api.PostMetadata;
}> = ({
  post,
  metadata: { maxSizeBytes, expireTimesSeconds, defaultExpireTimeSeconds },
}) => {
  const [expiresIn, setExpiresIn] = useState(defaultExpireTimeSeconds);

  const [state, encryptionError, cipherText, password] = useEncrypt(post);
  const [progress, id, uploadError, upload] = useUpload(expiresIn, cipherText);

  const error = useMemo(
    () => (uploadError ? 'An error occurred during upload' : encryptionError),
    [encryptionError, uploadError]
  );

  const isLoading = typeof state !== 'number';
  const isUploading = typeof progress === 'number';
  const isTooBig = typeof state === 'number' && state > maxSizeBytes;
  const isError = Boolean(error || isTooBig);
  const isReady = !isError && !isLoading && !isUploading;

  if (!isError && id && password) {
    return <CopyableLink id={id} password={password} />;
  }

  let buttonText = 'Upload';
  if (error) {
    buttonText = 'Error';
  } else if (isTooBig) {
    buttonText = 'Post is too big';
  } else if (isUploading) {
    buttonText = `Uploading ${Math.round(progress * 100)}%`;
  } else if (isLoading) {
    buttonText = makeLoadingText(state);
  }

  let buttonSubtext = undefined;
  if (error) {
    buttonSubtext = error;
  } else if (isReady || isTooBig) {
    buttonSubtext = `${formatSize(state)} / ${formatSize(maxSizeBytes)}`;
  }

  return (
    <>
      <ExpirationTimeSelector
        expireTimesSeconds={expireTimesSeconds}
        defaultExpireTimeSeconds={defaultExpireTimeSeconds}
        disabled={isUploading}
        onChange={setExpiresIn}
      />
      <UploadButton
        text={buttonText}
        subtext={buttonSubtext}
        loading={isLoading}
        ready={isReady}
        progress={progress}
        error={isError}
        onClick={upload}
      />
    </>
  );
};

export default UploadControls;
