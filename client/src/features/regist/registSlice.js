import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  regist_pool: [],
  edit_info: [],
  edit_pool: [],
  isEditting: false,
};

const slice = createSlice({
  name: "regist",
  initialState,
  reducers: {
    setRegistPool: (state, action) => {
      console.log("setRegistPool dispatch");
      return {
        ...state,
        regist_pool: action.payload,
        edit_info: action.payload.map(value => { return { title: "", composer: "" } }),
        edit_pool: action.payload.map(value => { return { title: "", composer: "" } }),
      };
    },
    setEditInfo: (state, action) => {
      console.log("setEditInfo dispatch");
      return {
        ...state,
        edit_info: action.payload,
      };
    },
    resetEditInfo: (state) => {
      console.log("resetEditInfo dispatch");
      return {
        ...state,
        edit_info: state.regist_pool.map(value => { return { title: "", composer: "" } }),
      };
    },
    setEditPool: (state, action) => {
      console.log("setEditInfo dispatch");
      return {
        ...state,
        edit_pool: action.payload
      };
    },
    resetEditPool: (state, action) => {
      console.log("resetEditPool dispatch");
      return {
        ...state,
        edit_pool: state.regist_pool.map(value => { return { title: "", composer: "" } }),
      };
    },
    setEditting: (state, action) => {
      console.log("setEditting dispatch");
      return {
        ...state,
        isEditting: action.payload
      };
    },
  },
});

export default slice.reducer;

export const { setRegistPool, setEditInfo, resetEditInfo, setEditting, setEditPool, resetEditPool } = slice.actions;