import User from '../../../../server/entity/User';
import { requestTypeLimitor } from '../../../../server/utils';

export default async function ApiAdminUserAdd(event) {
    let response = requestTypeLimitor(event, 'POST');
    if(response) return response;
    const reqJson = await event.request.json();
    if(!reqJson || !reqJson.name || !reqJson.password) {
        return new Response(JSON.stringify({ok: 0, msg: "Required field incomplete"}), {status: 400})
    }
    if(reqJson.name === 'admin') {
        return new Response(JSON.stringify({ok: 0, msg: "Admin user cannot be created via API"}), {status: 403})
    }
    const reqUser = await User.checkCookie(event);
    if(reqUser.name !== 'admin') {
        return new Response(JSON.stringify({ok: 0, msg: "Only admin user can add new user"}), {status: 403})
    }
    const addOperation = await User.createOrUpdate(reqJson.name, reqJson.password).catch(e => {
        return new Response(JSON.stringify({
            ok: 0,
            msg: e.message
        }), {
            status: 500
        })
    });
    if(!addOperation) {
        return new Response(JSON.stringify({
            ok: 0,
            msg: "Uncaught error"
        }), {
            status: 500
        })
    }
    return {
        ok: 1
    }
}