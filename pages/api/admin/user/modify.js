import User from '../../../../server/entity/User';
import { requestTypeLimitor } from '../../../../server/utils';

export default async function ApiAdminListUser(event) {
    let response = requestTypeLimitor(event, "POST");
    if (response) return response;
    let { name, cookie } = await User.checkCookie(event);
    if (!name) return new Response(null, { status: 401 });
    let reqJson = await event.request.json();
    if (!reqJson || !reqJson.password) {
        return new Response(JSON.stringify({
            ok: 0,
            msg: "Required field missing"
        }), {
            status: 400
        })
    }

    if (reqJson.type === 'self') {
        if (!oldpass) return new Response(JSON.stringify({
            ok: 0,
            msg: "Old password empty!"
        }), {
            status: 400
        })
        let verifyRes = await User.verify(name, reqJson.oldpass);
        if (!verifyRes) return new Response(JSON.stringify({
            ok: 0,
            msg: "Old password incorrect"
        }), {
            status: 400
        })
    } else {
        if (name !== 'admin') return new Response(JSON.stringify({
            ok: 0,
            msg: "You are not allowed to do this operation."
        }), {
            status: 403
        })
    }
    let result = await User.createOrUpdate(reqJson.type === 'self' ? name : reqJson.name, reqJson.password);
    if (!result) {
        return new Response(JSON.stringify({
            ok: 0,
            msg: "Uncaught error"
        }), {
            status: 500
        })
    }
    let selfModifyInit = {
        status: 302,
        headers: {
            "Set-cookie": User._cookieStr(),
            "Location": "/login"
        }
    }
    let successResInit = {
        status: 200
    }
    return new Response(JSON.stringify({
        ok: 1
    }), reqJson.type === "self" ? selfModifyInit : successResInit)
}