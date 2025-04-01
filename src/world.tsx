import React from 'react'

export default function Hello() {
  const [hydrated, setHydrated] = React.useState(false)
  React.useEffect(() => {
    setHydrated(true)
  }, [])

  return (
    <div id="world">
      <h2>World </h2>
      <div>hydrated: {String(hydrated)}</div>
      <a href="/hello">Hello</a>
    </div>
  )
}