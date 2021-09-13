import MockRecord from '../../server/entity/MockRecord'
import User from '../../server/entity/User'
import ClientJWT from '../../server/entity/ClientJWT'

export default async function ApiMock(event) {
  // const match = event.match
  // if (!match || !match.params || !match.params.recordid) {
  //   return new Response(JSON.stringify(match), {
  //     status: 401
  //   })
  // }
  let data = await User.checkCookie(event);
  return data || "{'data': 'none'}"
  if (!name) {
    // Get user auth from header's "Moker-Auth"
    let mokerAuth = event.request.headers.get("Moker-Auth");
    if (!mokerAuth) {
      return new Response(null, {
        status: 401
      })
    } else {
      let isValid = await ClientJWT.verify(mokerAuth);
      if (!isValid) return new Response(null, {
        status: 401
      })
      let data = await ClientJWT.decode(mokerAuth).catch(e => new Response(e.message, {
        status: 500
      }))
      name = data.userid
    }
  }
  const isFull = new URL(event.request.url).searchParams.get("full");
  let record = await MockRecord.find(name, match.params.recordid);
  if (!record) return new Response(null, {
    status: 404
  })
  if (isFull) {
    return new Response(record)
  } else {
    record = JSON.parse(record)
    // FIXME: not good, should be fetched on server side.
    if (record.content_type === "__proxy") return new Response(null, {
      status: 302,
      headers: {
        "Location": record.body
      }
    })
    return new Response(record.body, {
      status: record.status || 200,
      headers: {
        "Content-Type": record.content_type || "text/plain"
      }
    })
  }
}
