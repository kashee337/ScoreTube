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
  const pdf_path = useSelector(state => state.search.pdfPath);//`${process.env.PUBLIC_URL}/sample.pdf`

  if (isSearch) {
    return (
      <div className="App">
        <Layout>
          <ToolHeader></ToolHeader>
          <Layout>
            <Content className="App-content">
              <Row>
                <Col span={10} className="App-list">
                  <List />
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
  else {
    return (
      <div className="App">
        <Layout>
          <ToolHeader></ToolHeader>
          <Layout>
            <Content className="App-content">
              <Row>
                <Col span={10}>
                  <Pdf pdf_path={pdf_path} />
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
}

export default App;
