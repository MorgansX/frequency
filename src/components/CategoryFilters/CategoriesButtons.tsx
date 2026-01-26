import { Button } from '@heroui/react';
import { BTN_STYLES, SELECTED_BTN_STYLES } from './styles';

interface CategoriesButtonsProps {
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
}
export const CategoriesButtons = ({
  categories,
  selectedCategories,
  toggleCategory,
}: CategoriesButtonsProps) => (
  <div className="p-5 max-h-[50vh] overflow-y-auto">
    {categories.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <Button
              key={category}
              size="md"
              variant={isSelected ? 'primary' : 'secondary'}
              onPress={() => toggleCategory(category)}
              className={`
                              transition-all duration-200 ease-out
                              ${isSelected ? SELECTED_BTN_STYLES : BTN_STYLES}
                            `}
            >
              {category}
            </Button>
          );
        })}
      </div>
    ) : (
      <div className="text-center py-8 text-zinc-500">
        No categories available
      </div>
    )}
  </div>
);
