import { FC } from 'react';
import { ChevronDown } from 'lucide-react';
import { formatTime } from '../../../utils/utils';

const ExpirationTimeSelector: FC<{
  expireTimesSeconds: number[];
  defaultExpireTimeSeconds: number;
  disabled: boolean;
  onChange: (selectedExpireTime: number) => void;
}> = ({ expireTimesSeconds, defaultExpireTimeSeconds, disabled, onChange }) => {
  return (
    <div className="w-full mb-4">
      <span className="inline-block mb-0.5 text-sm text-zinc-500 dark:text-zinc-400">
        Expires in
      </span>
      <div className="relative w-full">
        <select
          className="w-full px-4 py-2 rounded-md shadow-sm appearance-none outline-none cursor-pointer ring-1 hover:ring-2 focus:ring-2 bg-white ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 hover:ring-emerald-500 focus:ring-emerald-500 dark:hover:ring-emerald-400 dark:focus:ring-emerald-400"
          defaultValue={defaultExpireTimeSeconds}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
        >
          {expireTimesSeconds.map((time) => (
            <option key={time} value={time}>
              {formatTime(time)}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDown size={20} className="text-zinc-500 dark:text-zinc-400" />
        </div>
      </div>
    </div>
  );
};

export default ExpirationTimeSelector;
