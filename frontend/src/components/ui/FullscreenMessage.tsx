import { FC, PropsWithChildren } from 'react';

const FullscreenMessage: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="mx-auto flex w-max max-w-full translate-y-[32vh] flex-col items-center gap-3">
      {children}
    </div>
  );
};

export default FullscreenMessage;
