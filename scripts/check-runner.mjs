import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'warn' })
const { checkRunner } = await server.ssrLoadModule('/src/dev/checkRunner.tsx')
const lines = checkRunner()
for (const l of lines) console.log(l)
await server.close()
process.exit(lines.some((l) => l.startsWith('FAIL')) ? 1 : 0)
