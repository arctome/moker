import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { collectFormData, cFetch } from '../client/utils'
import '../client/styles/pages/login.scss';
import 'flareact/router'

export default function PageLogin() {
    function submitHandler(e) {
        e.preventDefault();
        let data = collectFormData(e.target);
        if (!data.name || !data.password) {
            toast.error("Missing required field!")
            return;
        }
        cFetch('/api/login', {
            data,
            type: 'formdata',
            credentials: 'include'
        }).then(json => {
            if (json.ok) {
                toast.success("Login success, redirecting ...");
                setTimeout(() => { window.location.href = '/admin' }, 1500)
            } else {
                toast.error(json.msg)
            }
        })
    }

    useEffect(() => {
        const errmsg = new URL(window.location.href).searchParams.get("errmsg");
        if (errmsg) {
            toast.error(decodeURIComponent(errmsg))
        }
    }, [])

    return (
        <main className="card mokerpage--login">
            <form onSubmit={submitHandler} method="POST" action="/api/login?auto=1">
                <div className="form-group">
                    <label className="form-label" for="moker-login-name">User Name</label>
                    <input className="form-input" type="text" name="name" id="moker-login-name" placeholder="Username" />
                </div>
                <div className="form-group">
                    <label className="form-label" for="moker-login-password">Password</label>
                    <input className="form-input" type="password" name="password" id="moker-login-password" placeholder="Your password" />
                </div>
                <div className="btns-group">
                    <button className="btn btn-primary" type="submit">Login</button>
                </div>
            </form>
        </main>
    )
}