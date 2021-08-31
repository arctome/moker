import User from '../../../../server/entity/User';
import { requestTypeLimitor } from '../../../../server/utils';

export default async function ApiAdminListUser(event) {
    let response = requestTypeLimitor(event, "GET");
    if(response) return response;
    let data = await User.list().catch(e => {console.log(e)});
    return new Response(JSON.stringify({
        ...data,
        ok: 1
    }), {status: 200});
}