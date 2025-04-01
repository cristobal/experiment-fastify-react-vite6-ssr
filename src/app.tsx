import ReactDomServer from 'react-dom/server';
import fastify from "fastify";
import Hello from './hello';
import World from './world';

const app = fastify({});

app.get('/hello', async (request, reply) => {
  const ssrHtml = ReactDomServer.renderToString(<Hello />)
  let html = await importHtml()
  html = html.replace('{script}', 'hello.client').replace(/<body>/, `<body><div id="root">${ssrHtml}</div>`)
  return reply.header('content-type', 'text/html').send(html)
})

app.get('/world', async (request, reply) => {
  const ssrHtml = ReactDomServer.renderToString(<World />)
  let html = await importHtml()
  html = html.replace('{script}', 'world.client').replace(/<body>/, `<body><div id="root">${ssrHtml}</div>`)
  return reply.header('content-type', 'text/html').send(html)
})

async function importHtml() {
  if (import.meta.env.DEV) {
    const mod = await import('/index.html?raw')
    return __globalServer.transformIndexHtml('/', mod.default)
  } else {
    const mod = await import('/dist/client/index.html?raw') 
    return mod.default
  }
}

export { app };