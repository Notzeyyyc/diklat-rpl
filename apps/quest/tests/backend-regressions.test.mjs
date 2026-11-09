import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const root = new URL('../server/', import.meta.url)
const source = async (path) => readFile(new URL(path, root), 'utf8')

test('dashboard overview imports the database used by its queries', async () => {
  const text = await readFile(new URL('../../dashboard/server/api/admin/overview.get.ts', import.meta.url), 'utf8')
  assert.match(text, /import\s+\{\s*db\s*\}\s+from\s+['"]\.\.\/\.\.\/utils\/db['"]/) 
})

test('POS verification checks existing progress before consuming a code', async () => {
  const text = await source('api/pos/[id]/verify.post.ts')
  assert.match(text, /select 1 from team_progress[\s\S]*where team_id = \$\{team\.id\}[\s\S]*position_id = \$\{positionId\}/)
  assert.match(text, /update pos_codes[\s\S]*used_at is null/)
})
