import { create } from 'zustand';

export const DEFAULT_COUNTRY = 'Ukraine';

type State = {
  country: string;
  tags: string[];
};

type Actions = {
  setCountry: (country: string) => void;
  setTags: (tags: string[]) => void;
};
export const useCountry = create<State & Actions>((set) => ({
  country: DEFAULT_COUNTRY,
  tags: [],
  setCountry: (country) =>
    set(() => {
      if (!country) return { country: DEFAULT_COUNTRY };
      return { country };
    }),
  setTags: (tags: string[]) =>
    set(() => {
      return { tags };
    }),
}));
