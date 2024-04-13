import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface ILogs {
    allowed: boolean;
    entered: boolean;
    person_uuid: string;
    room_id: number;
    time: string;
}

type TLogs = ILogs[];

export const logsApi = createApi({
    reducerPath: 'logsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:9119/api/' }),
    endpoints: (builder) => ({
        getLogsByRoomId: builder.query<TLogs, number | string>({
            query: (room_id) => `logs?room_id=${room_id}`,
        }),
        getAllLogs: builder.query<TLogs, void>({
            query: () => `logs`,
        }),
    }),
})

export const { useGetLogsByRoomIdQuery, useGetAllLogsQuery } = logsApi;