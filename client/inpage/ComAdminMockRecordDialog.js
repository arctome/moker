import React, { forwardRef, useState, useRef, useImperativeHandle } from 'react';
import { collectFormData } from '../utils'

function ComAdminMockRecordDialog(props, ref) {
    const dialogRef = useRef();
    const [isActive, setIsActive] = useState(false)
    const [payload, setPayload] = useState(null)

    function submitHandler(e) {
        e.preventDefault()
        const data = collectFormData(e.target)
        props.submitHandler(data, payload);
    }

    useImperativeHandle(ref, () => ({
        showDialog: (payload) => {
            setIsActive(true)
            setPayload(payload)
        }
    }));

    return (
        <div className={['modal', isActive ? 'active' : ''].join(' ')} ref={dialogRef} id="modal-admin-mock-record">
            <a className="modal-overlay" aria-label="Close" onClick={(e) => { setIsActive(false) }}></a>
            <form className="modal-container" onSubmit={submitHandler}>
                <div className="modal-header">
                    <a className="btn btn-clear float-right" aria-label="Close" onClick={(e) => { setIsActive(false) }}></a>
                    <div className="modal-title h5">{props.dialogTitle}</div>
                </div>
                <div className="modal-body">
                    <div className="content">
                        <label class="form-label" for="moker--admin-records-name">Record Name</label>
                        <input class="form-input" type="text" id="moker--admin-records-name" placeholder="Record Name" name="name" />
                        <label class="form-label" for="moker--admin-records-url">URL</label>
                        <input class="form-input" type="text" id="moker--admin-records-url" placeholder="URL" name="url" />
                        <label class="form-label" for="moker--admin-records-collection">Collection</label>
                        <input class="form-input" type="text" name="collection" list="collections" id="moker--admin-records-collection" placeholder="Create a new collection or Use an exist collection..." />
                        <datalist id="collections">
                            <option>Test1</option>
                            <option>Test2</option>
                            <option>Test Ultimate</option>
                        </datalist>
                        <label class="form-label" for="moker--admin-records-httpstatus">HTTP Status</label>
                        <input class="form-input" type="number" id="moker--admin-records-httpstatus" placeholder="HTTP Status" name="http_status" defaultValue="200" />
                        <label class="form-label" for="moker--admin-records-contenttype">Content Type</label>
                        <select class="form-select" name="content_type" defaultValue="application/json" id="moker--admin-records-contenttype">
                            <option value="application/json">application/json</option>
                            <option value="application/x-www-form-urlencoded">application/x-www-form-urlencoded</option>
                            <option value="multipart/form-data">multipart/form-data</option>
                            <option value="text/*">text/*</option>
                            <option value="application/octet-stream">application/octet-stream</option>
                            <option value="__proxy">Just Proxy</option>
                        </select>
                        <label class="form-label" for="moker--admin-records-body">Request Body</label>
                        <textarea class="form-input" id="moker--admin-records-body" name="body" placeholder="Textarea" rows="3"></textarea>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn" type="button" onClick={(e) => { setIsActive(false) }}>Cancel</button>
                    <button className="btn btn-primary" style={{ marginLeft: '1rem' }} type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default forwardRef(ComAdminMockRecordDialog);