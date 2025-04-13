import { FC, PropsWithChildren } from 'react';

const FullscreenMessage: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="w-max max-w-full mx-auto translate-y-[32vh] flex flex-col items-center gap-3">
      {children}
    </div>
  );
};

export default FullscreenMessage;
