import { requestTypeLimitor } from '../../server/utils'
import User from '../../server/entity/User'

export default async function ApiUserLogin (event) {
  const response = requestTypeLimitor(event, 'POST')
  if (response) return response
  const reqBody = await event.request.text()
  const reqJson = Object.fromEntries(new URLSearchParams(reqBody).entries())
  const isAuto = new URL(event.request.url).searchParams.get('auto')
  // `auto=1` means the request is posted using `autocomplete` (with an "auto submit")
  if (!reqJson.name || !reqJson.password) {
    return new Response(JSON.stringify({
      ok: 0,
      msg: 'Required user name or password is missing'
    }), {
      status: isAuto ? 302 : 400,
      headers: isAuto
        ? {
            Location: `/login?errmsg=${encodeURIComponent('Required user name or password is missing')}`
          }
        : {}
    })
  }
  const checkRes = await User.login(reqJson.name, reqJson.password).catch(e => {
    return new Response(e.message, {
      status: 500
    })
  })
  if (!checkRes) {
    return new Response(JSON.stringify({ ok: 0, msg: 'Incorrect user name or password' }), {
      status: 400,
      headers: isAuto
        ? {
            Location: `/login?errmsg=${encodeURIComponent('Incorrect user name or password')}`
          }
        : {}
    })
  }
  return new Response(JSON.stringify({
    ok: 1
  }), {
    status: 200,
    headers: isAuto
      ? {
          'Set-Cookie': checkRes,
          Location: '/admin'
        }
      : {
          'Set-Cookie': checkRes
        }
  })
}
