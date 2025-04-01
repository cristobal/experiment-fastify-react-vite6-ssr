import { FastifyInstance, HTTPMethods } from 'fastify'
import {
  type Connect,
  type Plugin,
  type PluginOption,
  createServerModuleRunner,
  defineConfig,
} from 'vite'

export default defineConfig((env) => ({
  clearScreen: false,
  appType: 'custom',
  
  plugins: [
    vitePluginSsrMiddleware({
      entry: '/src/app',
    }),
    {
      name: 'global-server',
      configureServer(server) {
        Object.assign(globalThis, { __globalServer: server })
      },
    },
  ],
}))

// vavite-style ssr middleware plugin
export function vitePluginSsrMiddleware({
  entry,
  preview,
}: {
  entry: string
  preview?: string
}): PluginOption {
  const plugin: Plugin = {
    name: vitePluginSsrMiddleware.name,

    configureServer(server) {
      const runner = createServerModuleRunner(server.environments.ssr, {
        hmr: { logger: false },
      })
      const importWithRetry = async (): Promise<{ app: FastifyInstance }> => {
        try {
          return await runner.import(entry)
        } catch (e) {
          if (
            e instanceof Error &&
            (e as any).code === 'ERR_OUTDATED_OPTIMIZED_DEP'
          ) {
            runner.clearCache()
            return await importWithRetry()
          }
          throw e
        }
      }
      const handler: Connect.NextHandleFunction = async (req, res, next) => {
        try {
          const mod = await importWithRetry();
          const response = await mod['app'].inject({
            // @ts-expect-error ignore
            method: req.method,
            // @ts-expect-error ignore
            url: req.url,
          });
          const isHTML =
            response.headers['content-type']?.includes('text/html');
          if (!isHTML) {
            res.setHeaders(new Headers(response.headers)).end(response.body);
            return;
          }
          res
            .setHeader('content-type', 'text/html')
            .end(response.body as unknown as string);
        } catch (e) {
          next(e)
        }
      }
      return () => server.middlewares.use(handler)
    },
  }
  return [plugin]
}