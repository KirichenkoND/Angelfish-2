import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type TCategories = string[];

//TODO: дописать передачу аргументов через вопрос

export const categoriesApi = createApi({
    reducerPath: 'categoriesApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.securitypass.efbo.ru/' }),
    endpoints: (builder) => ({
        getCategories: builder.query<TCategories, string>({
            query: () => `people`,
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