import * as jwt from '@tsndr/cloudflare-worker-jwt';

const ClientJWT = {
    issue: async function (userid, note, expOffset) {
        if (!userid) throw new Error("[Entity - ClientJWT] no userid delivered.")
        // Creating a token
        const tokenSignPayload = {
            userid
        }
        if (expOffset && typeof expOffset === 'number' && expOffset > 0) {
            tokenSignPayload.exp = Math.floor(Date.now() / 1000) + expOffset
        }
        const token = await jwt.sign(tokenSignPayload, MOKER_CLIENT_JWT_SECRET).catch(e => {
            throw new Error("[Entity - ClientJWT] jwt.sign failed, message: " + e.message + ".")
        })
        // using a whitelist mode
        await MOKER_STORAGE_JWT.put(token, JSON.stringify({ created: Date.now(), userid, note }))
        return token;
    },
    revoke: async function (token) {
        if (!token) throw new Error("[Entity - ClientJWT] request revoke but no token delivered.")
        // Verifing token
        const isValid = await jwt.verify(token, MOKER_CLIENT_JWT_SECRET)
        if (!isValid) return false;
        const isExist = await MOKER_STORAGE_JWT.get(token);
        if (!isExist) return false;
        await MOKER_STORAGE_JWT.delete(token);
        return true;
    }
}

export default ClientJWT