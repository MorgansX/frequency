import { useRadioFilter } from '../useRadioFilter';
import { act } from '@testing-library/react';

describe('useRadioFilter', () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useRadioFilter.setState({
        filters: [],
        applyedFilters: [],
      });
    });
  });

  describe('initial state', () => {
    it('should have empty filters array', () => {
      const { filters } = useRadioFilter.getState();
      expect(filters).toEqual([]);
    });

    it('should have empty applyedFilters array', () => {
      const { applyedFilters } = useRadioFilter.getState();
      expect(applyedFilters).toEqual([]);
    });
  });

  describe('addFilters', () => {
    it('should add a filter to filters array', () => {
      const { addFilters } = useRadioFilter.getState();

      act(() => {
        addFilters('rock');
      });

      const { filters } = useRadioFilter.getState();
      expect(filters).toEqual(['rock']);
    });

    it('should add multiple filters sequentially', () => {
      const { addFilters } = useRadioFilter.getState();

      act(() => {
        addFilters('rock');
        addFilters('pop');
        addFilters('jazz');
      });

      const { filters } = useRadioFilter.getState();
      expect(filters).toEqual(['rock', 'pop', 'jazz']);
    });
  });

  describe('removeFilter', () => {
    it('should remove a filter from filters array', () => {
      act(() => {
        useRadioFilter.setState({ filters: ['rock', 'pop', 'jazz'] });
      });

      const { removeFilter } = useRadioFilter.getState();

      act(() => {
        removeFilter('pop');
      });

      const { filters } = useRadioFilter.getState();
      expect(filters).toEqual(['rock', 'jazz']);
    });

    it('should do nothing if filter does not exist', () => {
      act(() => {
        useRadioFilter.setState({ filters: ['rock', 'pop'] });
      });

      const { removeFilter } = useRadioFilter.getState();

      act(() => {
        removeFilter('jazz');
      });

      const { filters } = useRadioFilter.getState();
      expect(filters).toEqual(['rock', 'pop']);
    });
  });

  describe('clearFilters', () => {
    it('should clear all filters', () => {
      act(() => {
        useRadioFilter.setState({ filters: ['rock', 'pop', 'jazz'] });
      });

      const { clearFilters } = useRadioFilter.getState();

      act(() => {
        clearFilters();
      });

      const { filters } = useRadioFilter.getState();
      expect(filters).toEqual([]);
    });
  });

  describe('applySelectedFilters', () => {
    it('should copy filters to applyedFilters', () => {
      act(() => {
        useRadioFilter.setState({ filters: ['rock', 'pop'] });
      });

      const { applySelectedFilters } = useRadioFilter.getState();

      act(() => {
        applySelectedFilters();
      });

      const { applyedFilters } = useRadioFilter.getState();
      expect(applyedFilters).toEqual(['rock', 'pop']);
    });

    it('should not affect original filters array', () => {
      act(() => {
        useRadioFilter.setState({ filters: ['rock', 'pop'] });
      });

      const { applySelectedFilters } = useRadioFilter.getState();

      act(() => {
        applySelectedFilters();
      });

      const { filters } = useRadioFilter.getState();
      expect(filters).toEqual(['rock', 'pop']);
    });
  });

  describe('resetFiltersToUrlState', () => {
    it('should reset filters to match applyedFilters', () => {
      act(() => {
        useRadioFilter.setState({
          filters: ['rock', 'pop', 'jazz'],
          applyedFilters: ['rock'],
        });
      });

      const { resetFiltersToUrlState } = useRadioFilter.getState();

      act(() => {
        resetFiltersToUrlState();
      });

      const { filters } = useRadioFilter.getState();
      expect(filters).toEqual(['rock']);
    });

    it('should clear filters if applyedFilters is empty', () => {
      act(() => {
        useRadioFilter.setState({
          filters: ['rock', 'pop'],
          applyedFilters: [],
        });
      });

      const { resetFiltersToUrlState } = useRadioFilter.getState();

      act(() => {
        resetFiltersToUrlState();
      });

      const { filters } = useRadioFilter.getState();
      expect(filters).toEqual([]);
    });
  });
});
