import { useState, useEffect } from 'react'
import { useLocalStorage } from '@uidotdev/usehooks'

const useIsLoggedIn = () => {
  const [token] = useLocalStorage('token')
  const [isLoggedIn, setIsLoggedIn] = useState(!!token && (token !== ''))

  useEffect(() => {
    setIsLoggedIn(!!token && (token !== ''))
  }, [token])

  return isLoggedIn
}

export default useIsLoggedIn
