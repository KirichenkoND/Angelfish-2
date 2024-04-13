import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface IPermissions {
  category: string;
  person_uuid: string;
  role: string;
  room_id: number;
};

export interface IPermissionsOnly {
  person_uuid: string;
  room_id: number;
};

export interface IPermissionsOver {
  role: string;
  room_id: number;
};

export type perms = IPermissionsOnly | IPermissionsOver

export type TPermissions = IPermissions[];

//TODO: дописать передачу параметров в get запрос

export const permissionsApi = createApi({
  reducerPath: 'permissionsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:9119/api/' }),
  endpoints: (builder) => ({
    getPermissions: builder.query<TPermissions, void>({
      query: () => `permissions`,
    }),
    postPermissions: builder.mutation<string, { [k: string]: string | number; }>({
      query: (body) => ({ url: `permissions`, method: 'POST', body: body }),
    }),
    deletePermissions: builder.mutation<string, string>({
      query: (name) => ({ url: `Permissions/${name}`, method: 'DELETE' }),
    }),
  }),
})

export const { useGetPermissionsQuery, usePostPermissionsMutation, useDeletePermissionsMutation } = permissionsApi;