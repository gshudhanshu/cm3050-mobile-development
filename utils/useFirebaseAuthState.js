// import { useEffect } from 'react'
// import { auth } from '../firebase/firebase'
// import useAuthStore from '../store/useAuthStore'

// const useFirebaseAuthState = () => {
//   const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated)
//   const setUser = useAuthStore((state) => state.setUser)

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         // User is signed in.
//         setIsAuthenticated(true)
//         setUser(user)
//       } else {
//         // User is signed out.
//         setIsAuthenticated(false)
//         setUser(null)
//       }
//     })

//     return () => unsubscribe()
//   }, [setIsAuthenticated, setUser])
// }

// export default useFirebaseAuthState
