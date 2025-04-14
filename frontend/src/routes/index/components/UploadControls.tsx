import { FC, useMemo } from 'react';
import useEncrypt, { EncryptionState } from '../../../hooks/useEncrypt';
import { formatSize } from '../../../utils/utils';
import { Post } from '../../../utils/post';
import useUpload from '../../../hooks/useUpload';
import UploadButton from './UploadButton';
import CopyableLink from './CopyableLink';

const makeLoadingText = (state: EncryptionState): string => {
  switch (state) {
    case 'serialization':
      return 'Serializing';
    case 'compression':
      return 'Compressing';
    case 'encryption':
      return 'Encrypting';
    default:
      return 'Waiting';
  }
};

const maxSize = 200 * 1024 ** 2; // temp

const UploadControls: FC<{
  post: Post;
}> = ({ post }) => {
  const [state, encryptionError, cipherText, password] = useEncrypt(post);
  const [progress, id, uploadError, upload] = useUpload(3600, cipherText);

  const error = useMemo(
    () => (uploadError ? 'An error occurred during upload' : encryptionError),
    [encryptionError, uploadError]
  );

  const isLoading = typeof state !== 'number';
  const isUploading = typeof progress === 'number';
  const isTooBig = typeof state === 'number' && state > maxSize;
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
    buttonSubtext = `${formatSize(state)} / ${formatSize(maxSize)}`;
  }

  return (
    <UploadButton
      text={buttonText}
      subtext={buttonSubtext}
      loading={isLoading}
      ready={isReady}
      error={isError}
      onClick={upload}
    />
  );
};

export default UploadControls;
