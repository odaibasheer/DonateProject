import { configureStore } from '@reduxjs/toolkit';
import { authAPI } from './api/authAPI';
import { getMeAPI } from './api/getMeAPI';

import { useDispatch, useSelector } from 'react-redux';
import userReducer from './api/userSlice';
import { itemAPI } from './api/itemAPI';
import { assistanceAPI } from './api/assistanceAPI';
import { dashboardAPI } from './api/dashboardAPI';
import { userAPI } from './api/userAPI';
import { inventoryAPI } from './api/inventoryAPI';
import { taskAPI } from './api/taskAPI';

export const store = configureStore({
  reducer: {
    [authAPI.reducerPath]: authAPI.reducer,
    [getMeAPI.reducerPath]: getMeAPI.reducer,
    [itemAPI.reducerPath]: itemAPI.reducer,
    [assistanceAPI.reducerPath]: assistanceAPI.reducer,
    [dashboardAPI.reducerPath]: dashboardAPI.reducer,
    [inventoryAPI.reducerPath]: inventoryAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [taskAPI.reducerPath]: taskAPI.reducer,
    userState: userReducer
  },
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
        authAPI.middleware,
        getMeAPI.middleware,
        itemAPI.middleware,
        assistanceAPI.middleware,
        dashboardAPI.middleware,
        inventoryAPI.middleware,
        userAPI.middleware,
        taskAPI.middleware,
    ]),
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
