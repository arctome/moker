import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import Layout from '../../client/layout/Layout'
import { cFetch } from '../../client/utils'
import { useStore } from '../../client/state-persistence/global'
// Components
import ComAdminSettingDialog from '../../client/inpage/ComAdminSettingDialog'
import '../../client/styles/admin-settings-page.scss'
import { nanoid } from 'nanoid'

export default function PageAdminSettings () {
  const [tableList, setTableList] = useState([])
  const createDialogRef = useRef(null)
  const modifyDialogRef = useRef(null)
  const modifyOtherRef = useRef(null)
  const [state] = useStore()

  function createSubmitHandler (data) {
    if (data.password !== data.repass) {
      toast.error('Password mismatch !')
      return
    }
    delete data.repass
    cFetch('/api/admin/user/add', {
      data,
      method: 'POST',
      type: 'json',
      credentials: 'include'
    }).then(json => {
      if (json.ok) {
        toast.success('User add successfully, refreshing...')
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        toast.error(json.msg || 'Unexpect error occurs')
      }
    })
  }

  function modifyMyHandler (data) {
    if (data.password !== data.repass) {
      toast.error('Password mismatch !')
      return
    }
    delete data.repass
    cFetch('/api/admin/user/modify', {
      data: {
        ...data,
        type: 'self'
      },
      method: 'POST',
      type: 'json',
      credentials: 'include'
    }).then(json => {
      if (json.ok) {
        toast.success('Password modified successfully, redirecting to login page...')
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        toast.error(json.msg || 'Unexpect error occurs')
      }
    })
  }

  function modifyOthersHandler (data, payload) {
    const name = payload.name
    if (!name) {
      toast.error('No User Name detected !')
      return
    }
    if (data.password !== data.repass) {
      toast.error('Password mismatch !')
      return
    }
    delete data.repass
    cFetch('/api/admin/user/modify', {
      data: {
        ...data,
        name
      },
      method: 'POST',
      type: 'json',
      credentials: 'include'
    }).then(json => {
      if (json.ok) {
        toast.success('Password modified successfully, redirecting to login page...')
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        toast.error(json.msg || 'Unexpect error occurs')
      }
    })
  }

  function delUserHandler (e, name) {
    if (!name) {
      toast.error('No username detected!')
      return
    };
    cFetch('/api/admin/user/del', {
      method: 'DELETE',
      credentials: 'include',
      data: {
        name
      }
    }).then(json => {
      if (json.ok) {
        toast.success('Account has been deleted, return to login page...')
        return
      }
      toast.error(json.msg || 'Unexpect error')
    }, err => {
      toast.error(err)
    })
  }

  useEffect(() => {
    cFetch('/api/admin/user/list', {
      credentials: 'include',
      method: 'GET'
    }).then(json => {
      if (json.ok) {
        setTableList(json.keys)
      } else {
        toast.error(json.msg)
      }
    })
  }, [])

  return (
    <Layout>
      <div className="admin-settings-page">
        <div className="handler-btns-group">
          {state.user?.name === 'admin' ? <button className="btn btn-primary" onClick={() => { createDialogRef.current.showDialog() }}>Add User</button> : ''}
          <button className="btn" onClick={() => { modifyDialogRef.current.showDialog() }}>Reset My Password</button>
          {(state.user?.name && state.user?.name !== 'admin')
            ? (
            <div className="popover popover-right">
              <button className="btn btn-error">Delete My Account</button>
              <div className="popover-container">
                <div className="card">
                  <div className="card-header">
                    Notice
                  </div>
                  <div className="card-body">
                    The &quot;DELETE&quot; operation cannot be reverted, please CONFIRM!
                  </div>
                  <div className="card-footer">
                    <button className="btn btn-error" onClick={(e) => { delUserHandler(e, state.user?.name) }}>YES, I CONFIRM</button>
                  </div>
                </div>
              </div>
            </div>
              )
            : ''}
        </div>
        {/* Form */}
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {tableList.map(tr => {
              return (
                <tr key={tr.name}>
                  <td>{tr.name}</td>
                  <td>
                    <button className="btn btn-primary" disabled={!state.user?.name || state.user?.name !== 'admin'} onClick={() => { modifyOtherRef.current.showDialog({ name: tr.name }) }}>Modify</button>
                    {state.user?.name && state.user?.name === 'admin'
                      ? (
                      <div className="popover popover-top">
                        <button className="btn btn-error">Delete</button>
                        <div className="popover-container">
                          <div className="card">
                            <div className="card-header">
                              Notice
                          </div>
                            <div className="card-body">
                              The &quot;DELETE&quot; operation cannot be reverted, please CONFIRM!
                          </div>
                            <div className="card-footer">
                              <button className="btn btn-error" onClick={(e) => { delUserHandler(e, tr.name) }}>YES, I CONFIRM</button>
                            </div>
                          </div>
                        </div>
                      </div>
                        )
                      : ''}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {/* Modals */}
        <ComAdminSettingDialog
          ref={createDialogRef}
          dialogTitle="Add New User"
          submitHandler={createSubmitHandler}
          showParam={['name', 'password', 'repass']}
          id={nanoid(4)}
        />
        <ComAdminSettingDialog
          ref={modifyDialogRef}
          dialogTitle="Reset My Password"
          submitHandler={modifyMyHandler}
          showParam={['oldpass', 'password', 'repass']}
          id={nanoid(4)}
        />
        <ComAdminSettingDialog
          ref={modifyOtherRef}
          dialogTitle="Update Others Profile"
          submitHandler={modifyOthersHandler}
          showParam={['password', 'repass']}
          id={nanoid(4)}
        />
      </div>
    </Layout>
  )
}
