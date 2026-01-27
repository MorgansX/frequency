import { create } from 'zustand';

type State = {
  filters: string[];
  applyedFilters: string[];
};

type Actions = {
  addFilters: (filterItems: string) => void;
  clearFilters: () => void;
  removeFilter: (filterItems: string) => void;
  applySelectedFilters: () => void;
  resetFiltersToUrlState: () => void;
};

export const useRadioFilter = create<State & Actions>((set) => ({
  filters: [],
  applyedFilters: [],
  addFilters: (filterItems) =>
    set((state) => ({ filters: [...state.filters, filterItems] })),
  clearFilters: () => set(() => ({ filters: [] })),
  removeFilter: (filterItem) =>
    set((state) => ({
      filters: state.filters.filter((item) => item !== filterItem),
    })),
  applySelectedFilters: () =>
    set((state) => ({
      applyedFilters: state.filters,
    })),
  resetFiltersToUrlState: () =>
    set((state) => ({
      filters: state.applyedFilters,
    })),
}));
