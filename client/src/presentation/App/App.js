import { Col, Layout, Row } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import ToolHeader from '../components/Header/ToolHeader';
import List from "../components/List/List";
import Pdf from "../components/Pdf/Pdf";
import Video from "../components/Video/Video";
import './App.css';


const { Content } = Layout;

const App = () => {

  const isSearch = useSelector(state => state.search.isSearch);
  const pdf_path = useSelector(state => state.search.pdfPath);

  const LeftContent = isSearch ? <List /> : <Pdf pdf_path={pdf_path} />;

  return (
    <div className="App">
      <Layout>
        <ToolHeader></ToolHeader>
        <Layout>
          <Content className="App-content">
            <Row>
              <Col span={10}>
                {LeftContent}
              </Col>
              <Col span={14}>
                <Video />
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </div>
  );

}

export default App;
