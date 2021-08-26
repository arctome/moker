import React from 'react'
import './AdminIndexCards.scss'
import Link from 'flareact/link'

function Card(props) {
    const btns = props.btns || []
    return (
        <div className="card admin-index-card">
            {/* <div className="card-image">
                <img src="img/osx-el-capitan.jpg" className="img-responsive" />
            </div> */}
            <div className="card-header">
                <div className="card-title h5">{props.title}</div>
                <div className="card-subtitle text-gray">{props.subtitle}</div>
            </div>
            <div className="card-body">
                {props.children}
            </div>
            <div className="card-footer">
                {btns.map((btn, i) => (btn.href.indexOf("https://") > -1 || btn.href.indexOf("http://") > -1)
                    ? <a target="_blank" href={btn.href} key={i} class={["btn", btn.isPrimary ? "btn-primary" : ""].join(" ")}>{btn.text}</a>
                    : <Link href={btn.href} key={i}><a class={["btn", btn.isPrimary ? "btn-primary" : ""].join(" ")}>{btn.text}</a></Link>
                )}
            </div>
        </div>
    )
}

export default function AdminIndexCards(props) {
    return (
        <section className="admin-index-cards-section">
            <h3>Quick Visit</h3>
            <div className="admin-index-cards-wrapper">
                <Card
                    title="Chrome Extension"
                    subtitle="For quickly PC/Laptop development"
                    btns={[
                        { text: "Go to Store", href: "https://chrome.google.com/webstore?hl=zh-CN", isPrimary: true }
                    ]}
                />
                <Card
                    title="Document"
                    subtitle="Reference for usage"
                    btns={[
                        { text: "Visit", href: "https://chrome.google.com/webstore?hl=zh-CN", isPrimary: true }
                    ]}
                />
                <Card
                    title="Cloudflare Worker"
                    subtitle="Visit Cloudflare Dashboard"
                    btns={[
                        { text: "Visit", href: "https://dash.cloudflare.com", isPrimary: true }
                    ]}
                />
            </div>
        </section>
    )
}