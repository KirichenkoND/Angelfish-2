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
        getLogs: builder.query<TLogs, number | string | void>({
            query: (room_id) => `logs?room_id=${room_id}`,
        }),
    }),
})

export const { useGetLogsQuery } = logsApi;