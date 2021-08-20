export default async function ApiTest (event) {
    return new Response(event.request.url + "<br2 />" + JSON.stringify(event.request.match))
}