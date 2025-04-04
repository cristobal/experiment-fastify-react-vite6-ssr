import ReactDomServer from 'react-dom/server'
import type { Connect, ViteDevServer } from 'vite'
import Root from './root'

const handler: Connect.NextHandleFunction = async (_req, res) => {
  const ssrHtml = ReactDomServer.renderToString(<Root />)
  let html = await importHtml()
  return html.replace(/<body>/, `<body id="test"><div id="root">${ssrHtml}</div>`)
}

export default handler

declare let __globalServer: ViteDevServer

async function importHtml() {
  if (import.meta.env.DEV) {
    const mod = await import('/index.html?raw')
    return __globalServer.transformIndexHtml('/', mod.default)
  } else {
    const mod = await import('/dist/client/index.html?raw') 
    return mod.default
  }
}