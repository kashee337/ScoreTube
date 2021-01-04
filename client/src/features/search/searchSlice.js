import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSearch: false,
  keyList: [],
  titleList: [],
  composerList: [],
  pathList: [],
  pdfPath: "/sample.pdf",
  searchType: "title"
};

const slice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchFlag: (state, action) => {
      console.log("setSearchFlag dispatch");
      return {
        ...state,
        isSearch: action.payload
      };
    },
    setSongInfo: (state, action) => {
      console.log("setPathList dispatch");
      return {
        ...state,
        keyList: action.payload[0],
        titleList: action.payload[1],
        composerList: action.payload[2],
        pathList: action.payload[3]
      };
    },
    setPdfPath: (state, action) => {
      console.log("setPathList dispatch");
      return {
        ...state,
        pdfPath: action.payload,
        isSearch: false
      };
    },
    setSearchType: (state, action) => {
      console.log("setSearchtype dispatch");
      return {
        ...state,
        searchType: action.payload
      };
    }
  },
});

export default slice.reducer;

export const { setSearchFlag, setSongInfo, setPdfPath, setSearchType } = slice.actions;