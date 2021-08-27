import React, { useEffect } from 'react'
import Icon from '../common/Icon'
import Link from 'flareact/link'
import { useStore } from '../state-persistence/global'
import { cFetch } from '../utils'

export default function ComLayoutSidebar(props) {
    let showSidebar = props.showSidebar;
    const [state, dispatch] = useStore();

    function logoutHandler(e) {
        dispatch({ type: 'logout' })
    }

    useEffect(() => {
        if (!state.user) {
            cFetch('/api/admin/user/info', {
                credentials: 'include',
                method: "GET"
            }).then(json => {
                if (json.ok) dispatch({ type: 'login', data: { name: json.name } })
            })
        }
    }, [])

    return (
        <div className={["off-canvas-sidebar moker__sidebar", (showSidebar ? "active" : "")].join(" ")}>
            <div className="logo-holder">
                <div className="logo-holder__wrapper">
                    <Link href="/admin">
                        <a><img src="/logo.png" /></a>
                    </Link>
                </div>
                <p style={{ fontWeight: 700, marginTop: ".5rem" }}>Hello, {state.user?.name || ""}</p>
                <p><a className="btn btn-link" href="/api/logout" onClick={logoutHandler}>logout</a></p>
            </div>
            <ul className="menu menu-nav">
                <li className="menu-item"><Link href="/admin/browse"><a><Icon name="book" />Browse Records</a></Link></li>
                <li className="menu-item"><Link href="/admin/settings"><a><Icon name="setting" />Settings</a></Link></li>
                <li className="menu-item"><Link href="/admin/tokens"><a><Icon name="person" />Tokens</a></Link></li>
                <li className="menu-item"><Link href="/admin/about"><a><Icon name="person" />About</a></Link></li>
            </ul>
        </div>
    )
}