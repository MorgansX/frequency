import { Button } from '@heroui/react';

interface CategoriesFooterProps {
  selectedCount: number;
  clearAll: () => void;
  onClose: () => void;
  applyFilters: () => void;
}

export const CategoriesFooter = ({
  selectedCount,
  clearAll,
  applyFilters,
  onClose,
}: CategoriesFooterProps) => {
  const handleApplyFilters = () => {
    applyFilters();
    onClose();
  }
  return(
  <div className="flex items-center justify-between w-full p-5 border-t border-zinc-700/50 bg-zinc-800/30">
    <Button
      variant="ghost"
      onPress={clearAll}
      isDisabled={selectedCount === 0}
      className="text-zinc-400 hover:text-black"
    >
      Clear all
    </Button>
    <div className="flex gap-2">
      <Button
        variant="secondary"
        onPress={onClose}
        className="bg-zinc-700 hover:bg-zinc-600 text-white"
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        onPress={handleApplyFilters}
        className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white shadow-lg shadow-purple-500/25"
      >
        Apply filters
      </Button>
    </div>
  </div>
)};
