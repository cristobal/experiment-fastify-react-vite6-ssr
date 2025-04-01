import React from 'react'

export default function Hello() {
  const [hydrated, setHydrated] = React.useState(false)
  React.useEffect(() => {
    setHydrated(true)
  }, [])

  return (
    <div id="hello2">
      <h2>Hello</h2>
      <div>hydrated: {String(hydrated)}</div>
      <a href="/world">World</a>
    </div>
  )
}