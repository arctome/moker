import React from 'react'

export default function ComLayoutSidebar(props) {
    let showSidebar = props.showSidebar;
    return (
        <div id="sidebar-id" className={["off-canvas-sidebar moker__sidebar", (showSidebar ? "active" : "")].join(" ")}>
            <span>sidebar</span>
        </div>
    )
}