export function json(status: number, body: any) {
  return { statusCode: status, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }
}
