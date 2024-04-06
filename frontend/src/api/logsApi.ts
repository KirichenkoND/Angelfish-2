import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface ILogs {
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
        getLogs: builder.query<TLogs, void>({
            query: () => `logs`,
        }),
    }),
})

export const { useGetLogsQuery } = logsApi;