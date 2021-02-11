import { Layout } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import SplitPane, { Pane } from 'react-split-pane';
import ToolHeader from '../components/Header/ToolHeader';
import List from "../components/List/List";
import Pdf from "../components/Pdf/Pdf";
import Video from "../components/Video/Video";
import './App.css';


const App = () => {

  const isSearch = useSelector(state => state.search.isSearch);
  const pdf_path = useSelector(state => state.search.pdfPath);

  const LeftContent = isSearch ? <List /> : <Pdf pdf_path={pdf_path} />;
  return (
    <div className="App">
      <Layout>
        <ToolHeader></ToolHeader>
        <div className="App-content">
          <Layout>
            <SplitPane split="vertical" minSize="10%" maxsize="90%" defaultSize="50%">
              <Pane>
                {LeftContent}
              </Pane>
              <Pane>
                <Video />
              </Pane>
            </SplitPane>
          </Layout>
        </div>
      </Layout>
    </div >
  );

}

export default App;
