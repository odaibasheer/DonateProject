import { configureStore } from '@reduxjs/toolkit';
import { authAPI } from './api/authAPI';
import { getMeAPI } from './api/getMeAPI';

import { useDispatch, useSelector } from 'react-redux';
import userReducer from './api/userSlice';
import { itemAPI } from './api/itemAPI';

export const store = configureStore({
  reducer: {
    [authAPI.reducerPath]: authAPI.reducer,
    [getMeAPI.reducerPath]: getMeAPI.reducer,
    [itemAPI.reducerPath]: itemAPI.reducer,
    userState: userReducer
  },
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
        authAPI.middleware,
        getMeAPI.middleware,
        itemAPI.middleware,
    ]),
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
