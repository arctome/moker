import React from 'react'
import Layout from '../../client/layout/Layout'
import AdminIndexCards from '../../client/inpage/AdminIndexCards'

export default function PageAdminIndex () {
  return (
    <Layout>
      <div className="content">
        <h1>Homepage</h1>
        {/* TODO: what apis can be used? */}
        <section>
          <h3>Usage Summary</h3>
          <div>

          </div>
        </section>
        <AdminIndexCards />
      </div>
    </Layout>
  )
}
