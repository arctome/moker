import React from 'react'
import Icon from '../../client/common/Icon'
import Layout from '../../client/layout/Layout'
import '../../client/styles/admin-token-page.scss'
import PropTypes from 'prop-types'

function TokenOperationGroup (props) {
  if (!props.id) return <td>Error: This token is illegel.</td>
  return (
    <td className="token-table-btngroup">
      <button className="btn btn-primary">Re-generate</button>
      <div className="popover popover-left">
        <button className="btn btn-error">Revoke</button>
        <div className="popover-container">
          <div className="card">
            <div className="card-header">
              <strong>Attention</strong>
            </div>
            <div className="card-body">
              Revoked tokens <strong>cannot be recovered</strong>, do you <strong>{'really wanna revoke this token'.toUpperCase()}</strong> ?
            </div>
            <div className="card-footer">
              <button className="btn btn-error">I CONFIRM</button>
            </div>
          </div>
        </div>
      </div>
    </td>
  )
}

TokenOperationGroup.propTypes = {
  id: PropTypes.string
}

export default function PageAdminTokens () {
  return (
    <Layout>
      <div className="content">
        <section className="token-table-title">
          <h4>Tokens</h4>
          <div className="btngroup">
            <button className="btn btn-primary"><Icon name="plus" /> Add</button>
          </div>
        </section>
        <section className="token-table-tbody">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Note (with token prefix)</th>
                <th>Created at</th>
                <th className="token-table-btngroup">Operation</th>
              </tr>
            </thead>
            <tbody>
              <tr className="active">
                <td><p className="tbody-oneline-ellipsis"></p></td>
                <td>Crime, Drama</td>
                <TokenOperationGroup id={'asojfoasjf'} />
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </Layout>
  )
}
