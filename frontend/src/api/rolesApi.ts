import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

type TRoles = string;

type TGetRoles = TRoles[];

export const rolesApi = createApi({
  reducerPath: 'rolesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:9119/api/' }),
  endpoints: (builder) => ({
    getRoles: builder.query<TGetRoles, void>({
      query: () => `roles`,
    }),
    postRole: builder.mutation<string, string>({
      query: (name) => ({ url: `roles/${name}`, method: 'POST' }),
    }),
    deleteRole: builder.mutation<string, TRoles>({
      query: (name) => ({ url: `roles/${name}`, method: 'DELETE' }),
    }),
  }),
})

export const { useGetRolesQuery, usePostRoleMutation, useDeleteRoleMutation } = rolesApi;