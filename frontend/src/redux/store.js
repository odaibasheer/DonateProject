import { configureStore } from '@reduxjs/toolkit';
import { authAPI } from './api/authAPI';
import { getMeAPI } from './api/getMeAPI';

import { useDispatch, useSelector } from 'react-redux';
import userReducer from './api/userSlice';

export const store = configureStore({
  reducer: {
    [authAPI.reducerPath]: authAPI.reducer,
    [getMeAPI.reducerPath]: getMeAPI.reducer,
    userState: userReducer
  },
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
        authAPI.middleware,
        getMeAPI.middleware,
    ]),
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
