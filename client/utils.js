export function collectFormData(data) {
    const form = new FormData(data);
    const json = {};
    for (let pair of form.entries()) {
        json[pair[0]] = pair[1];
    }
    return json;
}

export function copyToClipboard(text) {
    if (text === "") return;
    var ipt = document.createElement('textarea')
    ipt.setAttribute(
        'style',
        'position:absolute;z-index:-1;width:1px;height:1px;top:-1px;opacity:0;-webkit-user-select: text;'
    )
    document.body.appendChild(ipt)
    ipt.value = text
    // ipt.select()
    if (/iphone|ipad|ios/.test(navigator.userAgent.toLowerCase())) {
        var oldContentEditable = ipt.contentEditable
        var oldReadOnly = ipt.readOnly
        var range = document.createRange()

        ipt.contentEditable = true
        ipt.readOnly = false
        range.selectNodeContents(ipt)

        var s = window.getSelection()
        s.removeAllRanges()
        s.addRange(range)

        ipt.setSelectionRange(0, 999999) // A big number, to cover anything that could be inside the element.

        ipt.contentEditable = oldContentEditable
        ipt.readOnly = oldReadOnly
    } else {
        ipt.select()
    }
    document.execCommand('Copy')
    ipt.blur()
    document.body.removeChild(ipt)
    ipt = null
}

export const loadScript = (url) => new Promise((resolve, reject) => {
    let ready = false;
    if (!document) {
        reject(new Error('Document was not defined'));
    }
    const tag = document.getElementsByTagName('script')[0];
    const script = document.createElement('script');

    script.type = 'text/javascript';
    script.src = url;
    script.async = true;
    script.onreadystatechange = () => {
        if (!ready && (!this.readyState || this.readyState === 'complete')) {
            ready = true;
            resolve(script);
        }
    };
    script.onload = script.onreadystatechange;

    script.onerror = (msg) => {
        console.log(msg);
        reject(new Error('Error loading script.'));
    };

    script.onabort = (msg) => {
        console.log(msg);
        reject(new Error('Script loading aboirted.'));
    };

    if (tag.parentNode != null) {
        tag.parentNode.insertBefore(script, tag);
    }
});

export function cFetch(url, option = {}) {
    option.method = option.method || "POST"
    const fetchInit = option;
    if(option.data && option.method !== "GET" && option.method !== "HEAD") {
        fetchInit.headers = option.headers || {};
        switch (option.type) {
            case "multipart":
                // fetchInit.body = JSON.stringify(option.data)
                if(typeof option.data === 'object') {
                    function getFormData(object) {
                        const formData = new FormData();
                        Object.keys(object).forEach(key => formData.append(key, object[key]));
                        return formData;
                    }
                    fetchInit.body = getFormData(option.data)
                } else {
                    fetchInit.body = option.data
                }
                fetchInit.headers["Content-Type"] = "multipart/form-data"
                delete fetchInit.data
                break;
            case "formdata":
                fetchInit.body = new URLSearchParams(option.data).toString()
                fetchInit.headers["Content-Type"] = "application/x-www-form-urlencoded"
                delete fetchInit.data
                break;
            case "plain":
                fetchInit.body = option.data;
                fetchInit.headers["Content-Type"] = "text/plain"
                delete fetchInit.data;
                break;
            default: // type: "json"
                fetchInit.body = JSON.stringify(option.data)
                fetchInit.headers["Content-Type"] = "application/json"
                delete fetchInit.data
        }
    }
    return fetch(url, fetchInit).then(async r => {
        if(r.status >= 500) {
            return {
                ok: 0,
                msg: "Server request failed",
                status: r.status
            }
        }
        if(r.status === 401) {
            window.location.href = '/login'
            return Promise.reject("Unauthorized");
        }
        let response = await r.json();
        if(response.redirect) {
            window.location.href = response.redirect
            return Promise.reject("Redirected");
        }
        return response;
    })
}