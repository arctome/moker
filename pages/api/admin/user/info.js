import { requestTypeLimitor } from '../../../../server/utils'
import User from '../../../../server/entity/User'

export default async function ApiFetchUserInfo(event) {
    let response = requestTypeLimitor(event, 'GET');
    if(response) return response;
    let user = await User.checkCookie(event);
    if(!user) return new Response(null, {status: 401})
    return {
        ok: 1,
        name: user.name
    }
}