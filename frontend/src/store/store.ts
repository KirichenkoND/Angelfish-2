import { configureStore } from '@reduxjs/toolkit';
import { categoriesApi } from "./../api/categoriesApi";
import { logsApi } from "./../api/logsApi";
import { peopleApi } from "./../api/peopleApi";
import { permissionsApi } from "./../api/permissionsApi";
import { rolesApi } from "./../api/rolesApi";
import { roomsApi } from "./../api/roomsApi";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
    reducer: {
        [categoriesApi.reducerPath]: categoriesApi.reducer,
        [logsApi.reducerPath]: logsApi.reducer,
        [peopleApi.reducerPath]: peopleApi.reducer,
        [permissionsApi.reducerPath]: permissionsApi.reducer,
        [rolesApi.reducerPath]: rolesApi.reducer,
        [roomsApi.reducerPath]: roomsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(
                categoriesApi.middleware,
                logsApi.middleware,
                peopleApi.middleware,
                permissionsApi.middleware,
                rolesApi.middleware,
                roomsApi.middleware
            )
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
