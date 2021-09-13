import React, { useEffect, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import { toast } from 'react-toastify'
import Layout from '../../client/layout/Layout'
import Icon from '../../client/common/Icon'
import '../../client/styles/admin-browse-page.scss'
// component
import ComAdminMockRecordDialog from '../../client/inpage/ComAdminMockRecordDialog'
import { cFetch } from '../../client/utils'

export default function PageAdminBrowse() {
  const createDialogRef = useRef(null);
  const [recordList, setRecordList] = useState([])

  function createSubmitHandler(data) {
    cFetch('/api/admin/mock/add', {
      data,
      method: 'POST',
      type: 'json',
      credentials: 'include'
    }).then(json => {
      if (json.ok) {
        toast.success('Mock record add successfully, refreshing...')
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        toast.error(json.msg || 'Unexpect error occurs')
      }
    })
  }

  function getRecordsList(page = 1, size = 20) {
    cFetch('/api/admin/mock/list', {
      method: 'GET',
      credentials: 'include'
    }).then(json => {
      if(json.ok) {
        setRecordList(json.data.list)
        return;
      }
      toast.error("Server Fetch error!")
    })
  }

  function editRecordHandler(mock_id) {
    if(!mock_id) return;
    cFetch(`/mock/${mock_id}?full=1`, {
      credentials: 'include',
      method: 'GET'
    }).then(json => {
      console.log(json)
    })
  }

  useEffect(() => {
    getRecordsList()
  }, [])

  return (
    <Layout>
      <div className="page-admin-browse-content">
        {/* handlebar */}
        <div className="handlebar">
          <h3>Mock Records</h3>
          <button class="btn btn-primary custom-icon-btn" onClick={() => { createDialogRef.current.showDialog() }}><Icon name="plus" style={{ marginRight: 10 }} />Create</button>
        </div>
        {/* table */}
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mock ID</th>
              <th>URL</th>
              <th>Collection</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>
            {
              recordList.map(r => {
                if(r) r = JSON.parse(r);
                return (
                  <tr>
                    <td>{r.name}</td>
                    <td>
                      {r.mock_id}
                    </td>
                    <td>{r.url}</td>
                    <td>{r.collection}</td>
                    <td>
                      <div className="btn-group btn-group-block" style={{ width: "5rem" }}>
                        <a className="btn btn-action btn-primary flex-center" title="Edit Record" onClick={(e) => {editRecordHandler(r.mock_id)}}><Icon name="pencil" /></a>
                        <a className="btn btn-action flex-center" title="Duplicate Record"><Icon name="copy" /></a>
                        <a className="btn btn-action btn-error flex-center" title="Delete Record"><Icon name="garbage" /></a>
                      </div>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
      <ComAdminMockRecordDialog
        ref={createDialogRef}
        dialogTitle="Add New Record"
        submitHandler={createSubmitHandler}
        id={nanoid(4)}
      />
    </Layout>
  )
}
