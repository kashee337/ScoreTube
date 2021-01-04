import { Button, Form, Input, Space } from 'antd';
import 'antd/dist/antd.css';
import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setEditPool } from "../../../features/regist/registSlice";

const EditForm = () => {
    const dispatch = useDispatch();
    const regist_pool = useSelector(state => state.regist.regist_pool);
    const edit_pool = useSelector(state => state.regist.edit_pool);
    const [form] = Form.useForm();

    const [editIdx, setEditIdx] = useState(0);
    const poolSize = regist_pool.length;


    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };

    const handleOnChange = () => {
        var tmp_edit_info = edit_pool.slice()
        tmp_edit_info[editIdx] = { title: form.getFieldValue("title"), composer: form.getFieldValue("composer") }
        dispatch(setEditPool(tmp_edit_info))
        console.log('set Success:', tmp_edit_info[editIdx], editIdx);
    }
    const previousPage = () => {
        setEditIdx(editIdx - 1);
        form.setFieldsValue({
            title: edit_pool[editIdx - 1].title,
            composer: edit_pool[editIdx - 1].composer,
        });

    }

    const nextPage = () => {
        setEditIdx(editIdx + 1);

        form.setFieldsValue({
            title: edit_pool[editIdx + 1].title,
            composer: edit_pool[editIdx + 1].composer,
        });
    }

    return (
        <>
            <Form
                {...layout}
                name="basic"
                initialValues={{
                    title: edit_pool[editIdx].title,
                    composer: edit_pool[editIdx].composer,
                    remember: false,
                }}
                preserve={false}
                form={form}
                onChange={handleOnChange}
            >
                <p>[{regist_pool[editIdx]}]</p>
                <Form.Item
                    label="曲名"
                    name="title"
                    rules={[
                        {
                            required: true,
                            message: 'Please input song title!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="作曲者"
                    name="composer"
                    rules={[
                        {
                            required: false,
                            message: 'Please input song composer!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Space size={[5, 5, 5]}>
                    <Button
                        disabled={editIdx <= 0}
                        onClick={previousPage}>
                        Previous
                    </Button>
                    <Button
                        disabled={editIdx >= poolSize - 1}
                        onClick={nextPage}>
                        Next
                    </Button>
                </Space>
            </Form>
        </>
    );
}

export default EditForm;
