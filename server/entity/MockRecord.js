import { jsonRequestFilter } from '../utils'
import { nanoid } from 'nanoid'

const MockRecord = {
    checkExist: async function(user, mockId) {
        let res = await MOKER_STORAGE_RECORD.get("u:"+user+"|"+mockId);
        return res !== null;
    },
    create: async function(user, data) {
        if(!user || !data) throw new Error("[Entity - MockRecord] No user or data")
        if(!jsonRequestFilter(data, ['name', 'url', 'collection', 'body', 'http_status', 'content_type'])) throw new Error("[Entity - MockRecord] Not correct keys in json.");
        const mockId = nanoid(8);
        await MOKER_STORAGE_RECORD.put("u:"+user+"|"+mockId, JSON.stringify({
            ...data,
            mock_id: mockId
        })).catch(e => {throw e});
        return mockId;
    },
    update: async function(user, data, mockId) {
        if(!user || !data) throw new Error("[Entity - MockRecord] No user or data")
        let oldRecord = await MOKER_STORAGE_RECORD.get("u:"+user+"|"+mockId);
        if(!oldRecord) throw new Error("[Entity - MockRecord] The request Mock ID is not found")
        let newRecord = Object.assign({}, oldRecord, data);
        await MOKER_STORAGE_RECORD.put("u:"+user+"|"+mockId, JSON.stringify(newRecord));
        return true;
    },
    find: async function(user, mockId) {
        return await MOKER_STORAGE_RECORD.get("u:"+user+"|"+mockId);
    },
    delete: async function(user, mockId) {
        let exist = await this.checkExist(user, mockId);
        if(!exist) return false;
        await MOKER_STORAGE_RECORD.delete("u:"+user+"|"+mockId)
        return true;
    },
    // extended base methods
    duplicate: async function(user, mockId) {
        let newId = nanoid(8);
        let targetRecord = await MOKER_STORAGE_RECORD.get("u:"+user+"|"+mockId)
        if(!targetRecord) return false;
        await MOKER_STORAGE_RECORD.put("u:"+user+"|"+newId, targetRecord);
        return true;
    },
    list: async function(user, cursor) {
        let data = await MOKER_STORAGE_RECORD.list({prefix: "u:"+user, cursor})
        let list = []
        data.keys.map(k => {
            list.push(this.find(user, k.name.replace('u:'+user+'|', '')))
        })
        return {
            cursor: data.cursor,
            list: await Promise.all(list)
        }
    }
}

export default MockRecord