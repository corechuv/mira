import type { Handler } from '@netlify/functions'
import { handleOptions, okJSON } from './_helpers'
export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return handleOptions()
  return okJSON({ ok: true })
}
