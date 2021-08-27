import { requestTypeLimitor } from '../../server/utils'
import User from '../../server/entity/User'

export default async function ApiUserLogout (event) {
  const response = requestTypeLimitor(event, 'GET')
  if (response) return response
  const checkRes = await User.logout(event)
  if (!checkRes) return new Response(null, { status: 401 })
  return new Response(JSON.stringify({
    ok: 1
  }), {
    status: 302,
    headers: {
      'Set-Cookie': checkRes,
      Location: '/login'
    }
  })
}
