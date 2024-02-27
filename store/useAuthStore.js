import { create } from 'zustand'

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  profile: null,
  setIsAuthenticated: (isAuthenticated) => set(() => ({ isAuthenticated })),
  setUser: (user) => set(() => ({ user })),
  setUserProfile: (profile) => set(() => ({ profile })),
}))

export default useAuthStore
