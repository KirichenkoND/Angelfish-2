import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface ILogin {
    phone: string;
    password: string;
}

export interface IProfile {
    phone: string;
    role: string;
}

//TODO: дописать передачу аргументов через вопрос

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:9119/api/' }),
    endpoints: (builder) => ({
        login: builder.mutation<{ token: string; role: string }, ILogin>({
            query: (credentials) => ({
                url: 'auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: 'auth/logout',
                method: 'POST'
            }),
        }),
        me: builder.query<IProfile, void>({
            query: () => `auth/me`,
        }),
    }),
})

export const { useLoginMutation, useLogoutMutation, useMeQuery } = authApi;