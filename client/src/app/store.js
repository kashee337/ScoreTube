import { configureStore } from '@reduxjs/toolkit';
import registSlice from '../features/regist/registSlice';
import searchSlice from '../features/search/searchSlice';
import videoSlice from '../features/video/videoSlice';

export default configureStore({
  reducer: {
    search: searchSlice,
    video: videoSlice,
    regist: registSlice,
  },
});
