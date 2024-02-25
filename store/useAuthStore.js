import { create } from 'zustand'

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  setIsAuthenticated: (isAuthenticated) => set(() => ({ isAuthenticated })),
  setUser: (user) => set(() => ({ user })),
}))

export default useAuthStore
