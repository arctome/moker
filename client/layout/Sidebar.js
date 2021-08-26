import React from 'react'
import Icon from '../common/Icon'
import Link from 'flareact/link'

export default function ComLayoutSidebar(props) {
    let showSidebar = props.showSidebar;
    return (
        <div className={["off-canvas-sidebar moker__sidebar", (showSidebar ? "active" : "")].join(" ")}>
            <div className="logo-holder">
                <div className="logo-holder__wrapper">
                    <Link href="/admin">
                        <a><img src="/logo.png" /></a>
                    </Link>
                </div>
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