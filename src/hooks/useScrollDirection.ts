import { useEffect, useState } from 'react'

export function useScrollDirection() {
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY

      if (currentScrollPos > prevScrollPos && currentScrollPos > 100) {
        // Scroll hacia abajo
        setVisible(false)
      } else {
        // Scroll hacia arriba
        setVisible(true)
      }

      setPrevScrollPos(currentScrollPos)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [prevScrollPos])

  return visible
}
