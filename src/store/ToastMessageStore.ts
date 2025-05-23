import { create } from 'zustand'

interface SlowMessageState {
  show: boolean;
  message: string;
  description: string;
  typeMessage: 'error' | 'success' | 'info' | 'warning';
  setParams: (value: {
    message: string;
    description: string;
    typeMessage: 'error' | 'success' | 'info' | 'warning';
    show: boolean;
  }) => void;
}

export const useToastMessageStore = create<SlowMessageState>((set) => ({
  show: false,
  message: 'Titulo',
  description: 'Descripcion',
  typeMessage: 'info',
  setParams: (value) => set({ ...value })
}))
