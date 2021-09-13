import MockRecord from '../../../../server/entity/MockRecord';
import User from '../../../../server/entity/User';
import { requestTypeLimitor } from '../../../../server/utils'

export default async function ApiAdminMockRecordDel(event) {
    let response = requestTypeLimitor(event, ['POST', 'DELETE'])
    if (response) return response;
    let { name } = await User.checkCookie(event);
    if (!name) return new Response(null, {
        status: 401
    })
    let data = await event.request.json();
    if (!data || !data.mock_id) return new Response(JSON.stringify({
        ok: 0,
        msg: "Missing required data"
    }), {
        status: 400
    })
    let delRes = await MockRecord.del(name, data.mock_id).catch(e => {
        return new Response(JSON.stringify({
            ok: 0,
            msg: e.message
        }), {
            status: 400
        })
    })
    if (!delRes) return new Response(JSON.stringify({
        ok: 0,
        msg: "Delete Error"
    }), {
        status: 500
    })
    return new Response(JSON.stringify({
        ok: 1
    }))
}