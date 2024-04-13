import { configureStore } from '@reduxjs/toolkit';
import { categoriesApi } from "./../api/categoriesApi";
import { logsApi } from "./../api/logsApi";
import { peopleApi } from "./../api/peopleApi";
import { permissionsApi } from "./../api/permissionsApi";
import { rolesApi } from "./../api/rolesApi";
import { roomsApi } from "./../api/roomsApi";
import { authApi } from "./../api/authApi";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import userSlice from './Slices/userSlice';

export const store = configureStore({
    reducer: {
        user: userSlice,
        [categoriesApi.reducerPath]: categoriesApi.reducer,
        [logsApi.reducerPath]: logsApi.reducer,
        [peopleApi.reducerPath]: peopleApi.reducer,
        [permissionsApi.reducerPath]: permissionsApi.reducer,
        [rolesApi.reducerPath]: rolesApi.reducer,
        [roomsApi.reducerPath]: roomsApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(
                categoriesApi.middleware,
                logsApi.middleware,
                peopleApi.middleware,
                permissionsApi.middleware,
                rolesApi.middleware,
                roomsApi.middleware,
                authApi.middleware
            )
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
