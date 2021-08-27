import hmacSHA512toHex from '../encrypt'
import { customAlphabet } from 'nanoid'
import { getCookie } from '../utils';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 10);

const User = {
    _config: {
        maxAge: 3 * 24 * 60 * 60
    },
    // if !token, return a logout cookie
    _cookieStr: function (token, maxAge) {
        if (token) return `MOKER_SESSION=${token}; Domain=${MOKER_DEPLOY_DOMAIN || ".workers.dev"}; Max-Age=${maxAge || 0}; SameSite=Lax; Path=/; Secure; HttpOnly;`;
        return `MOKER_SESSION=; Domain=${MOKER_DEPLOY_DOMAIN || ".workers.dev"}; Max-Age=-1; SameSite=Lax; Path=/; Secure; HttpOnly;`
    },
    // login & logout operate only use session storage
    verify: async function (username, password) {
        if (!username || !password) throw new Error("[Entity - User] login with no username or password!");
        // admin
        if(username === 'admin') {
            return password === MOKER_ADMIN_PASS;
        }
        let encryptedPass = await hmacSHA512toHex(password, MOKER_HMAC_PASSWORD_SECRET).catch(e => { throw new Error("[Entity - User] hmacSHA512toHex occurs unexpected error, message: " + e.message) })
        let storedPass = await MOKER_STORAGE_USER.get(username)
        if (storedPass === encryptedPass) return true;
        return false;
    },
    checkCookie: async function (event) {
        if (!event || !event.request) throw new Error("[Entity - User] checkCookie with illegel request event!");
        let cookie = getCookie(event.request.headers.get("Cookie"), "MOKER_SESSION");
        if (!cookie) return false;
        let username = await MOKER_SESSION_USER.get("t:" + cookie);
        if (!username) return false;
        return { username, cookie };
    },
    login: async function (username, password) {
        if (!username || !password) throw new Error("[Entity - User] login with no username or password!");
        let verifyResult = await this.verify(username, password).catch(e => { throw e });
        if (!verifyResult) return false;
        const token = nanoid();
        // expire old if exist
        let oldToken = await MOKER_SESSION_USER.get("u:" + username);
        if (oldToken) await MOKER_SESSION_USER.delete("t:" + oldToken);
        await Promise.all([
            MOKER_SESSION_USER.put("u:" + username, token, { expirationTtl: this._config.maxAge }),
            MOKER_SESSION_USER.put("t:" + token, username, { expirationTtl: this._config.maxAge })
        ])
        return this._cookieStr(token, this._config.maxAge);
    },
    logout: async function (event) {
        let { username, cookie } = await this.checkCookie(event);
        if (username) {
            await Promise.all([
                MOKER_SESSION_USER.delete("u:" + username),
                MOKER_SESSION_USER.delete("t:" + cookie)
            ])
            return this._cookieStr();
        }
        return false;
    },
    // operations below will modify user storage
    checkExist: async function (username) {
        if (!username) throw new Error("[Entity - User] checkExist with no username!");
        let isExist = await MOKER_STORAGE_USER.get(username).catch(e => { throw e });
        if (isExist) return true;
        return false;
    },
    createOrUpdate: async function (username, password) {
        if (!username || !password) throw new Error("[Entity - User] createOrUpdate with no username or password!");
        let encryptedPass = await hmacSHA512toHex(password, MOKER_HMAC_PASSWORD_SECRET).catch(e => { throw new Error("[Entity - User] hmacSHA512toHex occurs unexpected error, message: " + e.message) })
        await MOKER_STORAGE_USER.put(username, encryptedPass).catch(e => { throw e });
        return true;
    },
    // remove api cannot remove `admin`, and only verified admin can remove other users
    remove: async function (username, password) {
        if (!username || !password) throw new Error("[Entity - User] createOrUpdate with no username or password!");
        if (username !== 'admin') return false;
        // check pass
        let checkResult = await this.verify(username, password);
        if (!checkResult) return false;
        await MOKER_STORAGE_USER.delete(username);
    }
}

export default User;