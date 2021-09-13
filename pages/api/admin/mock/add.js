import MockRecord from '../../../../server/entity/MockRecord';
import User from '../../../../server/entity/User';
import { requestTypeLimitor } from '../../../../server/utils'

export default async function ApiAdminMockRecordAdd(event) {
    let response = requestTypeLimitor(event, ['POST', 'PUT'])
    if(response) return response;
    let { name } = await User.checkCookie(event);
    if(!name) return new Response(null, {
        status: 401
    })
    let data = await event.request.json();
    if(!data) return new Response(JSON.stringify({
        ok: 0,
        msg: "Missing required data"
    }), {
        status: 400
    })
    if(data.mock_id) return new Response(JSON.stringify({
        ok: 0,
        msg: "Create Record should not have exact id"
    }), {
        status: 400
    })
    let createRes = await MockRecord.create(name, data).catch(e => {
        return new Response(JSON.stringify({
            ok: 0,
            msg: e.message
        }), {
            status: 400
        })
    }).catch(e => {
        return new Response("Server error: "+e.message, {
            status: 500
        })
    })
    if(!createRes) return new Response(JSON.stringify({
        ok: 0,
        msg: "Create Error"
    }), {
        status: 500
    })
    return new Response(JSON.stringify({
        ok: 1,
        mock_id: createRes
    }))
}