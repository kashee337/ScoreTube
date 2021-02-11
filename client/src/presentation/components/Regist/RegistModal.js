import { Button, message, Modal } from 'antd';
import 'antd/dist/antd.css';
import axios from "axios";
import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { resetEditInfo, resetEditPool, setEditPool, setEditting } from "../../../features/regist/registSlice";
import EditModal from "./EditModal";
import RegistForm from "./RegistForm";

const RegistModal = () => {
    const dispatch = useDispatch();

    const regist_pool = useSelector(state => state.regist.regist_pool);
    const edit_info = useSelector(state => state.regist.edit_info);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const showModal = () => {
        resetRegist();
        setVisible(true);
    };

    const handleCancel = () => {
        resetRegist();
        setVisible(false);
    }
    // 一時情報の削除
    const resetRegist = () => {
        const url = `${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/regist_reset`
        axios.get(url, { timeout: 1000 })
            .then(res => { console.log("reset regist pool") })
            .catch((e) => {
                console.log("connection error");
                message.error("接続エラーです。");
            });
    }
    const handleEdit = () => {
        dispatch(setEditPool(edit_info));
        dispatch(setEditting(true));
    }

    async function commitRegist(data) {
        const url = `${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/regist_commit`
        const response = await axios.post(url, data)
            .then(res => {
                console.log("commit regist pool")
                message.info("登録しました")
            })
            .catch((e) => {
                console.log("connection error");
                message.error("接続エラーです。");
            });
        return
    }

    const handleSubmit = () => {
        var data = { "title": [], composer: [] }
        for (let ei of edit_info) {
            data["title"].push(ei.title);
            data["composer"].push(ei.composer);
        }
        dispatch(resetEditInfo);
        dispatch(resetEditPool);

        commitRegist(data)
        console.log("commit", data);

        // loading表示処理
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setVisible(false);
        }, 1000);
    };

    const editDisableCheck = () => {
        return !(regist_pool.length > 0);
    }
    const submitDisableCheck = () => {
        return edit_info.length === 0 || edit_info.some(value => value.title.length === 0) || !(regist_pool.length > 0);
    }

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Regist PDF
            </Button>
            <Modal
                visible={visible}
                title="Regist PDF"
                onCancel={handleCancel}
                footer={[
                    <Button onClick={handleEdit} disabled={editDisableCheck()}>
                        Edit
                    </Button>,
                    <Button key="submit" loading={loading} onClick={handleSubmit} disabled={submitDisableCheck()}>
                        Submit
                    </Button>,
                ]}
                destroyOnClose>
                <RegistForm />
            </Modal>
            <EditModal />
        </>
    );
}

export default RegistModal;
