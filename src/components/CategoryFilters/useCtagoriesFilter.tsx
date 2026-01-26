import { useRadioFilter } from '@/store/useRadioFilter';
import { useSearchParams } from 'next/navigation';
import {  useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useCategoriesFilter = () => {
  const { filters,applyedFilters, clearFilters,removeFilter, addFilters, applySelectedFilters } = useRadioFilter();
  const searchParams = useSearchParams();
    const router = useRouter();

  //TODO: set filters from URL to store on mount
  const selectedCategories =
    searchParams.get('categories')?.split(',').filter(Boolean) ?? filters;
  const selectedCount = applyedFilters.length;

  const updateURLQuery = (newCategories: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newCategories.length > 0) {
        params.set('categories', newCategories.join(','));
      } else {
        params.delete('categories');
      }
      router.push(`?${params.toString()}`);
    }

  const toggleCategory = (category: string) => {
    if (!filters.includes(category)) {
      addFilters(category);
    } else {
      removeFilter(category);
  }
};

  const clearAll = () => {
    updateURLQuery([]);
    clearFilters();
  };

  const applyFilters = () => {
    applySelectedFilters();
    updateURLQuery(selectedCategories);
  }


  useEffect(() => {
    if(selectedCategories.length === 0) return;
    selectedCategories.forEach((cat) => addFilters(cat));
    applySelectedFilters();
  },[]);


  return {
    selectedCategories,
    selectedCount,
    toggleCategory,
    clearAll,
    applyFilters,
  };
};
