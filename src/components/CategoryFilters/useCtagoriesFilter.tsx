import { useRadioFilter } from '@/store/useRadioFilter';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export const useCategoriesFilter = () => {
  const {
    filters,
    applyedFilters,
    clearFilters,
    removeFilter,
    addFilters,
    applySelectedFilters,
    resetFiltersToUrlState,
  } = useRadioFilter();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isInitialized = useRef(false);

  const selectedCount = applyedFilters.length;

  const updateURLQuery = (newCategories: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newCategories.length > 0) {
      params.set('categories', newCategories.join(','));
    } else {
      params.delete('categories');
    }
    router.push(`?${params.toString()}`);
  };

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
    applySelectedFilters();
  };

  const applyFilters = () => {
    applySelectedFilters();
    updateURLQuery(filters);
  };

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const urlCategories = searchParams
      .get('categories')
      ?.split(',')
      .filter(Boolean);
    if (urlCategories && urlCategories.length > 0) {
      urlCategories.forEach((cat) => addFilters(cat));
      applySelectedFilters();
    }
  }, []);

  return {
    selectedCategories: filters,
    selectedCount,
    toggleCategory,
    clearAll,
    applyFilters,
    resetFiltersToUrlState,
  };
};
