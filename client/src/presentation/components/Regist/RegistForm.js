import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { useDispatch } from "react-redux";
import { setRegistPool } from "../../../features/regist/registSlice";
const { Dragger } = Upload;

const RegistForm = () => {
    const dispatch = useDispatch();

    const handleChange = (e) => {
        // console.log(e.fileList);
        const regist_pool = e.fileList.map(val => val.name);
        console.log(regist_pool)

        dispatch(setRegistPool(regist_pool));
    }

    const props = {
        action: `${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/regist_pool`,
        onChange: handleChange,
        openFileDialogOnClick: false,
        directory: true,
        accept: "application/pdf"
    }
    return (
        <>
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Drag file to this area to upload</p>
            </Dragger>
        </>
    );
}

export default RegistForm;