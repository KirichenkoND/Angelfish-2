import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface IPeople {
    ban_reason: string;
    banned: boolean;
    first_name: string;
    last_name: string;
    middle_name: string;
    role: string;
    uuid: string;
};

type TPeople = IPeople[];

//TODO: дописать передачу аргументов через вопрос

export const peopleApi = createApi({
    reducerPath: 'peopleApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.securitypass.efbo.ru/' }),
    endpoints: (builder) => ({
        getPeople: builder.query<TPeople, string>({
            query: () => `people`,
        }),
        postPeople: builder.mutation<string, IPeople>({
            query: (body) => ({ url: `people`, method: 'POST', body }),
        }),
        putPeople: builder.mutation<string, { uuid: string, body: IPeople }>({
            query: (args) => ({ url: `people/${args.uuid}`, method: 'PUT', body: args.body }),
        }),
        deletePeople: builder.mutation<string, string>({
            query: (uuid) => ({ url: `people/${uuid}`, method: 'DELETE' }),
        }),
    }),
})

export const { useDeletePeopleMutation, useGetPeopleQuery, usePostPeopleMutation, usePutPeopleMutation } = peopleApi;