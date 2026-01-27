import { renderHook, act } from '@testing-library/react';
import { useCategoriesFilter } from '../useCtagoriesFilter';
import { useRadioFilter } from '@/store/useRadioFilter';

// Mock next/navigation
const mockPush = jest.fn();
const mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}));

describe('useCategoriesFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams.delete('categories');

    // Reset store state
    act(() => {
      useRadioFilter.setState({
        filters: [],
        applyedFilters: [],
      });
    });
  });

  describe('initial state', () => {
    it('should return empty selectedCategories', () => {
      const { result } = renderHook(() => useCategoriesFilter());

      expect(result.current.selectedCategories).toEqual([]);
    });

    it('should return selectedCount as 0', () => {
      const { result } = renderHook(() => useCategoriesFilter());

      expect(result.current.selectedCount).toBe(0);
    });
  });

  describe('toggleCategory', () => {
    it('should add category when not selected', () => {
      const { result } = renderHook(() => useCategoriesFilter());

      act(() => {
        result.current.toggleCategory('rock');
      });

      expect(result.current.selectedCategories).toContain('rock');
    });

    it('should remove category when already selected', () => {
      act(() => {
        useRadioFilter.setState({ filters: ['rock', 'pop'] });
      });

      const { result } = renderHook(() => useCategoriesFilter());

      act(() => {
        result.current.toggleCategory('rock');
      });

      expect(result.current.selectedCategories).not.toContain('rock');
      expect(result.current.selectedCategories).toContain('pop');
    });

    it('should toggle multiple categories', () => {
      const { result } = renderHook(() => useCategoriesFilter());

      act(() => {
        result.current.toggleCategory('rock');
        result.current.toggleCategory('pop');
        result.current.toggleCategory('jazz');
      });

      expect(result.current.selectedCategories).toEqual([
        'rock',
        'pop',
        'jazz',
      ]);

      act(() => {
        result.current.toggleCategory('pop');
      });

      expect(result.current.selectedCategories).toEqual(['rock', 'jazz']);
    });
  });

  describe('clearAll', () => {
    it('should clear all selected categories', () => {
      act(() => {
        useRadioFilter.setState({
          filters: ['rock', 'pop', 'jazz'],
          applyedFilters: ['rock', 'pop', 'jazz'],
        });
      });

      const { result } = renderHook(() => useCategoriesFilter());

      act(() => {
        result.current.clearAll();
      });

      expect(result.current.selectedCategories).toEqual([]);
      expect(result.current.selectedCount).toBe(0);
    });

    it('should update URL to remove categories param', () => {
      act(() => {
        useRadioFilter.setState({ filters: ['rock'] });
      });

      const { result } = renderHook(() => useCategoriesFilter());

      act(() => {
        result.current.clearAll();
      });

      expect(mockPush).toHaveBeenCalledWith('?');
    });
  });

  describe('applyFilters', () => {
    it('should apply selected filters', () => {
      const { result } = renderHook(() => useCategoriesFilter());

      act(() => {
        result.current.toggleCategory('rock');
        result.current.toggleCategory('pop');
      });

      act(() => {
        result.current.applyFilters();
      });

      const { applyedFilters } = useRadioFilter.getState();
      expect(applyedFilters).toEqual(['rock', 'pop']);
    });

    it('should update URL with selected categories', () => {
      const { result } = renderHook(() => useCategoriesFilter());

      act(() => {
        result.current.toggleCategory('rock');
        result.current.toggleCategory('pop');
      });

      act(() => {
        result.current.applyFilters();
      });

      expect(mockPush).toHaveBeenCalledWith('?categories=rock%2Cpop');
    });
  });

  describe('resetFiltersToUrlState', () => {
    it('should reset filters to match applied filters', () => {
      act(() => {
        useRadioFilter.setState({
          filters: ['rock', 'pop', 'jazz'],
          applyedFilters: ['rock'],
        });
      });

      const { result } = renderHook(() => useCategoriesFilter());

      act(() => {
        result.current.resetFiltersToUrlState();
      });

      expect(result.current.selectedCategories).toEqual(['rock']);
    });
  });

  describe('selectedCount', () => {
    it('should reflect the count of applied filters', () => {
      act(() => {
        useRadioFilter.setState({
          filters: [],
          applyedFilters: ['rock', 'pop', 'jazz'],
        });
      });

      const { result } = renderHook(() => useCategoriesFilter());

      expect(result.current.selectedCount).toBe(3);
    });
  });
});
