import React, { useState } from 'react'
import 'spectre.css'
import 'spectre.css/dist/spectre-icons.css'
import 'spectre.css/dist/spectre-exp.min.css'
import Sidebar from './Sidebar'
import Header from './Header'
import '../styles/layout.scss'
import '../styles/styled-scrollbar.scss'

export default function ComLayout(props) {
    const [showSidebar, setShowSidebar] = useState(false);

    function sidebarToggler(state) {
        setShowSidebar(state)
    }
    return (
        <div className="off-canvas off-canvas-sidebar-show moker__off-canvas">
            <Header sidebarToggler={sidebarToggler} />
            <Sidebar  showSidebar={showSidebar} />
            <a className="off-canvas-overlay" onClick={() => sidebarToggler(false)}></a>
            <div className="off-canvas-content moker__off-canvas-content">
                {props.children}
            </div>
        </div>
    )
}