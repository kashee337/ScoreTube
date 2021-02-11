import { Button, message, Modal } from 'antd';
import 'antd/dist/antd.css';
import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { resetEditPool, setEditInfo, setEditting } from "../../../features/regist/registSlice";
import EditForm from "./EditForm";

const EditModal = () => {
    const dispatch = useDispatch();
    const isEditting = useSelector(state => state.regist.isEditting);
    const edit_pool = useSelector(state => state.regist.edit_pool);

    const handleCancel = () => {
        dispatch(setEditting(false));
        dispatch(resetEditPool());
    }
    const handleOk = () => {
        dispatch(setEditInfo(edit_pool))
        dispatch(setEditting(false));
        message.info("編集結果を一時保存しました")
        if (edit_pool.some(value => value.title.length === 0)) {
            message.warn("未編集の項目があります")
        }
    };

    return (
        <>
            <Modal
                visible={isEditting}
                title={`Edit`}
                onCancel={handleCancel}
                footer={[
                    <Button onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button onClick={handleOk}>
                        Ok
                    </Button>,
                ]}
                destroyOnClose
            >
                <EditForm />
            </Modal>
        </>
    );
}

export default EditModal;
