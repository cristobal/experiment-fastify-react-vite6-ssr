import ReactDomClient from 'react-dom/client'
import React from 'react'
import World from './world'

async function main() {
  const el = document.getElementById('root')
  React.startTransition(() => {
    ReactDomClient.hydrateRoot(el!, <World />)
  })
}

main()