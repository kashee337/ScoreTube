import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    videoItems: [],
    videoNumber: 0,
};

const slice = createSlice({
    name: "video",
    initialState,
    reducers: {
        setVideoItems: (state, action) => {
            console.log("setVideos dispatch");
            return {
                ...state,
                videoItems: action.payload,
                videoNumber: 0
            };
        },
        incrementVideo: (state, action) => {
            console.log("incrementVideo dispatch");
            return {
                ...state,
                videoNumber: state.videoNumber + 1
            };
        },
        decrementVideo: (state, action) => {
            console.log("decrementVideo dispatch");
            return {
                ...state,
                videoNumber: state.videoNumber - 1
            };
        },
    },
});

export default slice.reducer;

export const { setVideoItems, incrementVideo, decrementVideo } = slice.actions;