import { requestTypeLimitor } from '../../../../server/utils'
import ClientJWT  from '../../../../server/entity/ClientJWT'

export default async function ApiAdminJWTIssue(event) {
    let response = requestTypeLimitor(event, 'GET');
    if(response) return response;
    const token = await ClientJWT.issue("testuser");
    return {ok: 1, token}
}