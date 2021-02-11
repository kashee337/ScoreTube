
import { DeleteOutlined } from "@ant-design/icons";
import { Avatar, Button, List, message, Modal } from "antd";
import "antd/dist/antd.css";
import axios from 'axios';
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setPdfPath, setSongInfo } from "../../../features/search/searchSlice";
import { setVideoItems } from "../../../features/video/videoSlice";

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

const SongList = (props) => {
  const dispatch = useDispatch();
  const pathList = useSelector(state => state.search.pathList);
  const keyList = useSelector(state => state.search.keyList);
  const titleList = useSelector(state => state.search.titleList);
  const composerList = useSelector(state => state.search.composerList);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [selectedItem, setSelected] = useState(null);

  const handleClick = (value) => {
    const [path, title, composer] = value;
    console.log("select", title, composer, path);
    dispatch(setPdfPath(path));

    // search video
    const url = "https://www.googleapis.com/youtube/v3/search"
    axios.get(url, {
      params: {
        type: "video", part: "snippet", maxResults: 10,
        q: `${title} ${composer}`, key: YOUTUBE_API_KEY
      },
      timeout: 1000
    }).then(res => {
      dispatch(setVideoItems(res.data.items))
    }).catch((e) => {
      console.log("connection error");
    });

  }
  const handleCancelDelete = () => {
    setVisibleDelete(false);
  }
  const handleSelect = (path) => {
    setSelected(path);
    setVisibleDelete(true);
  }

  const handleDelete = (path) => {
    console.log("delete", path);
    const url = `${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/delete`;
    axios.get(url, { params: { path: path } }).then(
      res => {
        if (res.data.error) {
          message.debug(res.data.error);
        }
        else {
          message.warning("削除完了しました。");
          const data = res.data.queryResults;
          dispatch(setSongInfo([data.key, data.title, data.composer, data.path]));
        }
      }
    ).catch(
      (e) => {
        console.log("connection error");
        message.error("接続エラーです。");
      }
    )

    setSelected(null);
    setVisibleDelete(false);
  }
  const renderItem = (title, idx) => {
    const composer = composerList[idx]
    const path = pathList[idx]
    const key = keyList[idx]
    return (
      <List.Item key={key}>
        <List.Item.Meta
          avatar={<Avatar src="https://illustration-free.net/thumb/png/ifn0443.png" />}
          title={<a>{title}</a>}
          description={composer}
          onClick={() => { handleClick([path, title, composer]) }}
        />
        <DeleteOutlined onClick={() => handleSelect(path)} />
      </List.Item>
    );
  };

  return (
    <div>
      <List
        header={<div>song info</div>}
        bordered
        dataSource={titleList}
        renderItem={renderItem}
        style={{ background: "gray" }}
      />
      <Modal
        visible={visibleDelete}
        title={selectedItem}
        onOk={handleDelete}
        onCancel={handleCancelDelete}
        footer={[
          <Button key="cancel" onClick={handleCancelDelete}>
            Cancel
            </Button>,
          <Button key="submit" type="primary" danger onClick={() => handleDelete(selectedItem)}>
            Delete
            </Button>,
        ]}
      >
        <p>本当に削除しますか？</p>
      </Modal>
    </div>
  )
}

export default SongList;