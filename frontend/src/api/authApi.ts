import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface ILogin {
    phone: string;
    password: string;
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
    }),
})

export const { useLoginMutation } = authApi;