// Regenerates the home-screen icons from the app's own Figure component.
// macOS only (uses qlmanage); the PNGs are committed, so CI never runs this.
import { execFileSync } from 'node:child_process'
import { mkdtempSync, renameSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'warn' })
const { renderIcon } = await server.ssrLoadModule('/src/dev/renderIcon.tsx')
const dir = mkdtempSync(join(tmpdir(), 'hg-icon-'))
const svg = join(dir, 'icon.svg')
writeFileSync(svg, renderIcon())
await server.close()

execFileSync('qlmanage', ['-t', '-s', '512', '-o', dir, svg], { stdio: 'ignore' })
renameSync(join(dir, 'icon.svg.png'), 'public/icon-512.png')
execFileSync('sips', ['-z', '192', '192', 'public/icon-512.png', '--out', 'public/icon-192.png'], { stdio: 'ignore' })
console.log('wrote public/icon-512.png and public/icon-192.png')
