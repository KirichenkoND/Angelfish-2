import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface IRoom {
    category: string;
    floor: number;
    name: string;
}

type TRooms = IRoom[];

//TODO: дописать передачу аргументов через вопрос

export const roomsApi = createApi({
    reducerPath: 'roomsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.securitypass.efbo.ru/' }),
    endpoints: (builder) => ({
        getRoom: builder.query<TRooms, string>({
            query: () => `rooms`,
        }),
        postRoom: builder.mutation<string, IRoom>({
            query: (body) => ({ url: `rooms`, method: 'POST', body }),
        }),
        postToggleRoom: builder.mutation<string, {room_id: number, direction: string, uuid: string}>({
            query: (args) => ({ url: `rooms/${args.room_id}/${args.direction}/${args.uuid}`, method: 'POST' }),
        }),
        deleteRooms: builder.mutation<string, string>({
            query: (room_id) => ({ url: `categories/${room_id}`, method: 'DELETE' }),
        }),
    }),
})

export const { useGetRoomQuery, usePostRoomMutation, usePostToggleRoomMutation, useDeleteRoomsMutation } = roomsApi;