import User from '../../../../server/entity/User';
import { requestTypeLimitor } from '../../../../server/utils';

export default async function ApiAdminUserDel(event) {
    let response = requestTypeLimitor(event, "DELETE");
    if(response) return response;
    let { name } = await User.checkCookie(event);
    if(!name) return new Response(null, {
        status: 401
    })
    let reqJson = await event.request.json();
    if(!reqJson.name) return new Response({
        ok: 0,
        msg: "Request field incomplete!"
    }, {
        status: 400
    })
    if(
        (reqJson.name !== name && name !== 'admin') || reqJson.name === 'admin'
    ) {
        return new Response({
            ok: 0,
            msg: "You are not granted to do this operation!"
        }, {
            status: 401
        })
    }
    
    let delResult = await User.remove(reqJson.name).catch(e => {
        return new Response(e.message, {
            status: 500
        })
    });
    if(delResult) return new Response(JSON.stringify({
        ok: 1
    }), {
        status: 200
    })
    return new Response(JSON.stringify({
        ok: 0,
        msg: "User is not exist"
    }), {
        status: 400
    })
}