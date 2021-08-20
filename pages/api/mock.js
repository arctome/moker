export default async function ApiMock (event) {
  const match = event.match
  if (!match || !match.params || !match.params.recordid) {
    return new Response(null, 401)
  }
  return new Response(JSON.stringify(match))
}
