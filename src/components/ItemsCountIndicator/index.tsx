import { Chip } from '@heroui/react';

export const ItemsCountIndicator = ({ count }: { count: number }) => (
  <>
    {Boolean(count) && (
      <Chip className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
        {count}
      </Chip>
    )}
  </>
);
