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
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.securitypass.efbo.ru/' }),
    endpoints: (builder) => ({
        getLogs: builder.query<TLogs, string>({
            query: () => `people`,
        }),
    }),
})

export const { useGetLogsQuery } = logsApi;