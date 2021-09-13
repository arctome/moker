import MockRecord from '../../../../server/entity/MockRecord';
import User from '../../../../server/entity/User';
import { requestTypeLimitor } from '../../../../server/utils'

export default async function ApiAdminMockRecordDel(event) {
    let response = requestTypeLimitor(event, 'GET')
    if (response) return response;
    let { name } = await User.checkCookie(event);
    if (!name) return new Response(null, {
        status: 401
    })
    let cursor = new URL(event.request.url).searchParams.get("cursor")
    let listRes = await MockRecord.list(name, cursor || "").catch(e => {
        return new Response(JSON.stringify({
            ok: 0,
            msg: e.message
        }), {
            status: 400
        })
    })
    if (!listRes) return new Response(JSON.stringify({
        ok: 0,
        msg: "Delete Error"
    }), {
        status: 500
    })
    return new Response(JSON.stringify({
        ok: 1,
        data: listRes
    }))
}