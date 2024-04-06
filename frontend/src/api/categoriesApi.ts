import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export type TCategories = string[];

//TODO: дописать передачу аргументов через вопрос

export const categoriesApi = createApi({
    reducerPath: 'categoriesApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:9119/api/' }),
    endpoints: (builder) => ({
        getCategories: builder.query<TCategories, void>({
            query: () => `categories`,
        }),
        postCategories: builder.mutation<string, string>({
            query: (category) => ({ url: `categories/${category}`, method: 'POST' }),
        }),
        deleteCategories: builder.mutation<string, string>({
            query: (category) => ({ url: `categories/${category}`, method: 'DELETE' }),
        }),
    }),
})

export const { useGetCategoriesQuery, usePostCategoriesMutation, useDeleteCategoriesMutation } = categoriesApi;