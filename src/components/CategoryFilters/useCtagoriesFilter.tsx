import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export const useCategoriesFilter = ({router}:{router: any}) => {
  const searchParams = useSearchParams();

  const selectedCategories =
    searchParams.get('categories')?.split(',').filter(Boolean) ?? [];
  const selectedCount = selectedCategories.length;

  const updateURL = useCallback(
    (newCategories: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newCategories.length > 0) {
        params.set('categories', newCategories.join(','));
      } else {
        params.delete('categories');
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((cat) => cat !== category)
      : [...selectedCategories, category];
    updateURL(newCategories);
  };

  const clearAll = () => updateURL([]);

  return {
    selectedCategories,
    selectedCount,
    toggleCategory,
    clearAll,
  };
};
