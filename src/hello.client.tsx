import ReactDomClient from 'react-dom/client'
import React from 'react'
import Hello from './hello'

async function main() {
  const el = document.getElementById('root')
  React.startTransition(() => {
    ReactDomClient.hydrateRoot(el!, <Hello />)
  })
}

main()