import React from 'react'
import { useEffect } from 'react'

export function useIsMounted() {
  const isMounted = React.useRef(true)

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  return isMounted // returning "isMounted.current" wouldn't work because we would return unmutable primitive
}
