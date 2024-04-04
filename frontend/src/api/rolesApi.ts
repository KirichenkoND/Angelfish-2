import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type TRoles = "admin" | "none" | "security" | "service" | "student" | "teacher";

type TGetRoles = TRoles[];

export const rolesApi = createApi({
  reducerPath: 'rolesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.securitypass.efbo.ru/' }),
  endpoints: (builder) => ({
    getRoles: builder.query<TGetRoles, string>({
      query: () => `roles`,
    }),
    postRole: builder.mutation<string, TRoles>({
      query: (name) => ({ url: `roles/${name}`, method: 'POST' }),
    }),
    deleteRole: builder.mutation<string, TRoles>({
      query: (name) => ({ url: `roles/${name}`, method: 'DELETE' }),
    }),
  }),
})

export const { useGetRolesQuery, usePostRoleMutation, useDeleteRoleMutation } = rolesApi;