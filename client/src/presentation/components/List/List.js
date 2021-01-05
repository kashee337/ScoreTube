
import { Avatar, List } from "antd";
import "antd/dist/antd.css";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { setPdfPath } from "../../../features/search/searchSlice";
import { setVideoItems } from "../../../features/video/videoSlice";

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

const SongList = (props) => {
  const dispatch = useDispatch();
  const pathList = useSelector(state => state.search.pathList);
  const keyList = useSelector(state => state.search.keyList);
  const titleList = useSelector(state => state.search.titleList);
  const composerList = useSelector(state => state.search.composerList);

  const handleClick = (value) => {
    const [path, title, composer] = value;
    console.log("select", title);
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
      />
    </div>
  )
}

export default SongList;