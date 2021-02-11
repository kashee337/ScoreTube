import { Input, message } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setVideoItems } from "../../../features/video/videoSlice";
const { Search } = Input;

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

const VideoSearchFrom = () => {
    const dispatch = useDispatch();

    const handleSearch = (searchQuery) => {
        // search video
        const url = "https://www.googleapis.com/youtube/v3/search"
        axios.get(url, {
            params: {
                type: "video", part: "snippet", maxResults: 10,
                q: searchQuery, key: YOUTUBE_API_KEY
            },
            timeout: 1000
        }).then(res => {
            dispatch(setVideoItems(res.data.items))
        }).catch((e) => {
            console.log("connection error");
            message.error("接続エラーです。");
        });
    }

    return (
        <div>
            <Search
                placeholder="好きなkeywordで動画を検索して下さい"
                style={{ width: 500, margin: '0px 0px 30px' }}
                onSearch={handleSearch}
            />
        </div>
    )

}

export default VideoSearchFrom;