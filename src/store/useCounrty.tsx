import { create } from 'zustand';

export const DEFAULT_COUNTRY = 'Ukraine';

type State = {
  country: string;
};

type Actions = {
  setCountry: (country: string) => void;
};
export const useCountry = create<State & Actions>((set) => ({
  country: DEFAULT_COUNTRY,
  setCountry: (country) =>
    set(() => {
      if (!country) return { country: DEFAULT_COUNTRY };
      return { country };
    }),
}));
