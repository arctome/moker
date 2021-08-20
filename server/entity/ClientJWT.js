const ClientJWT = {
    issue: async function() {

    },
    // You can't really revoke a token stored in Client side, but you can blacklist it.
    revoke: async function() {}    
}

export default ClientJWT