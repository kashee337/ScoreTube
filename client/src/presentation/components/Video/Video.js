import { Button, Space } from 'antd/es';
import { useDispatch, useSelector } from "react-redux";
import { decrementVideo, incrementVideo } from "../../../features/video/videoSlice";
import "./Video.css";
import VideoSearchFrom from './VideoSearchForm';
const Video = () => {
    const dispatch = useDispatch();
    const videoItems = useSelector(state => state.video.videoItems)
    const videoNumber = useSelector(state => state.video.videoNumber)
    const numVideo = videoItems.length;

    function previousVideo() {
        dispatch(decrementVideo());
    }

    function nextVideo() {
        dispatch(incrementVideo());
    }

    var video_url = "https://www.youtube.com/embed/sBZa7-2bG2I";

    if (numVideo > 0) {
        video_url = 'https://www.youtube.com/embed/' + videoItems[videoNumber].id.videoId;
        console.log("play", video_url)
    }

    return (
        <div className="Video">
            <VideoSearchFrom />
            <iframe
                id="ytplayer"
                type="ytplayer"
                src={video_url}
                frameBorder="0"
                className="Video-content"
            />

            <Space size={[5, 5]}>
                <Button disabled={videoNumber == 0}
                    onClick={previousVideo}
                >
                    Previous
             </Button>
                <Button
                    disabled={videoNumber >= numVideo - 1}
                    onClick={nextVideo}
                >
                    Next
            </Button>
            </Space>
        </div >
    )
}

export default Video;