

import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

export interface GlobalState {
  accountId: string;
}

const initialState = {
  accountId: '',
}

const useGlobalState = create<Global>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        hasHydrated: false,
        login: (r: GlobalState) => {
          set(() => ({
            ...r,
          }))
        },
      }),
      {
        name: 'global-storage',
        onRehydrateStorage: () => (state) => {
          if (state) state.hasHydrated = true
        },
      }
    )
  )
)


type Global = GlobalState & {
  hasHydrated: boolean;
  login: (r: GlobalState) => void;
}

export default useGlobalState;
