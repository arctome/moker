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
                        <img src="/logo.png" />
                    </Link>
                </div>
            </div>
            <ul className="menu menu-nav">
                <li className="menu-item"><Link href="/admin/browse"><span><Icon name="book" />Browse Records</span></Link></li>
                <li className="menu-item"><Link href="/admin/settings"><span><Icon name="setting" />Settings</span></Link></li>
                <li className="menu-item"><Link href="/admin/about"><span><Icon name="person" />About</span></Link></li>
            </ul>
        </div>
    )
}