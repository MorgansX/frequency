import { Chip } from '@heroui/react';

export const PlayerTags = ({ tags }: { tags: string }) => (
  <div className="pt-2">
    {tags && (
      <div className="flex gap-1 flex-wrap">
        {tags
          .split(',')
          .slice(0, 4)
          .map((tag: string) => (
            <Chip
              key={tag.trim()}
              size="sm"
              color="warning"
              variant="soft"
              className="px-2 py-1 gap-1"
            >
              {tag.trim()}
            </Chip>
          ))}
      </div>
    )}
  </div>
);
