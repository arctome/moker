import React, { forwardRef, useState, useRef, useImperativeHandle } from 'react';
import { collectFormData } from '../utils'

function ComAdminSettingDialog(props, ref) {
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
        <div className={['modal', isActive ? 'active' : ''].join(' ')} ref={dialogRef} id="modal-add-user">
            <a className="modal-overlay" aria-label="Close" onClick={(e) => { setIsActive(false) }}></a>
            <form className="modal-container" onSubmit={submitHandler}>
                <div className="modal-header">
                    <a className="btn btn-clear float-right" aria-label="Close" onClick={(e) => { setIsActive(false) }}></a>
                    <div className="modal-title h5">{props.dialogTitle}</div>
                </div>
                <div className="modal-body">
                    <div className="content">
                        {
                            props.showParam.includes("name") ? (
                                <div className="form-group">
                                    <label className="form-label" htmlFor={"mokerpage-admin-setting-name-" + props.id}>User Name</label>
                                    <input className="form-input" name="name" type="text" id={"mokerpage-admin-setting-name-" + props.id} placeholder="User Name" />
                                </div>
                            ) : ""
                        }
                        {
                            props.showParam.includes("oldpass") ? (
                                <div className="form-group">
                                    <label className="form-label" htmlFor={"mokerpage-admin-setting-oldpass-" + props.id}>Old Password</label>
                                    <input className="form-input" name="oldpass" type="password" id={"mokerpage-admin-setting-oldpass-" + props.id} placeholder="Old Password" />
                                </div>
                            ) : ""
                        }
                        {
                            props.showParam.includes("password") ? (
                                <div className="form-group">
                                    <label className="form-label" htmlFor={"mokerpage-admin-setting-pass-" + props.id}>Password</label>
                                    <input className="form-input" name="password" type="password" id={"mokerpage-admin-setting-pass-" + props.id} placeholder="Repeat password" />
                                </div>
                            ) : ""
                        }
                        {
                            props.showParam.includes("repass") ? (
                                <div className="form-group">
                                    <label className="form-label" htmlFor={"mokerpage-admin-setting-repass=" + props.id}>Repeat Password</label>
                                    <input className="form-input" name="repass" type="password" id={"mokerpage-admin-setting-repass=" + props.id} placeholder="Repeat password" />
                                </div>
                            ) : ""
                        }
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

export default forwardRef(ComAdminSettingDialog);