import { Radio } from 'antd';
import 'antd/dist/antd.css';
import { useDispatch } from "react-redux";
import { setSearchType } from "../../../features/search/searchSlice";

const ModeRadio = () => {
    const dispatch = useDispatch();

    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        dispatch(setSearchType(e.target.value));
    };

    return (
        <div>
            <Radio.Group onChange={onChange} buttonStyle="solid" defaultValue="title">
                <Radio.Button value="title">title</Radio.Button>
                <Radio.Button value="composer">composer</Radio.Button>
            </Radio.Group>
        </div>
    );
};

export default ModeRadio;