import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'warn' })
const { smoke } = await server.ssrLoadModule('/src/dev/smoke.tsx')
for (const line of smoke()) console.log(line)
await server.close()
