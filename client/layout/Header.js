import React from 'react'

export default function ComLayoutHeader(props) {
    const sidebarToggler = props.sidebarToggler;
    return (
        <header className="navbar moker__navbar">
            <section class="navbar-section">
                <a className="off-canvas-toggle btn btn-link btn-action" onClick={() => sidebarToggler(true)}>
                    <i className="icon icon-menu"></i>
                </a>
            </section>
            <section class="navbar-section">
                <div className="btns d-flex">
                    <a className="btn ml-1" href="https://www.paypal.me/picturepan2" target="_blank">PayPal</a>
                    <a className="btn btn-primary ml-1" href="https://github.com/picturepan2/spectre" target="_blank">GitHub</a>
                </div>
            </section>
        </header>
    )
}