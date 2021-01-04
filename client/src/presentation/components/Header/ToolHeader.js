import { Col, Layout, Row } from "antd";
import RegistModal from "../Regist/RegistModal";
import ModeRadio from "./ModeRadio";
import SongSearchForm from "./SongSearchForm";
import "./ToolHeader.css";
const { Header } = Layout;

const ToolHeader = () => {

    const handleClick = () => {
        window.location.reload();
    }
    return (
        <Header className="header">
            <Row>
                <Col span={4}>
                    <div className="logo" onClick={handleClick}></div>
                </Col>
                <Col span={2.5}>
                    <ModeRadio />
                </Col>
                <Col span={7.5}>
                    <SongSearchForm />
                </Col>
                <Col span={6}>
                    <RegistModal />
                </Col>
            </Row>
        </Header>
    )
}

export default ToolHeader;