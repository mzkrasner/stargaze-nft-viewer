import { create } from "zustand";

type Store = {
  color: string;
  setColor: (color: string) => void;
};

const useStore = create<Store>((set) => ({
  color: "",
  setColor: (color) => set({ color })
}));

export default useStore;
