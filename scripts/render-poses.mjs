// Renders the Day 1 pose sheet to an SVG + PNG so poses can be eyeballed
// without a browser. Uses Vite's SSR loader so the real components are used.
import { writeFileSync } from 'node:fs'
import { createServer } from 'vite'

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'warn',
})
const { renderSheet } = await server.ssrLoadModule('/src/dev/renderSheet.tsx')
// `npm run poses -- chest-press` renders just one exercise.
writeFileSync('/tmp/posesheet.svg', renderSheet(process.argv[2]))
await server.close()
console.log('wrote /tmp/posesheet.svg')
