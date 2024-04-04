import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface IPermissions {
  category: string;
  person_uuid: string;
  role: string;
  room_id: number;
};

type TPermissions = IPermissions[];

//TODO: дописать передачу параметров в get запрос

export const permissionsApi = createApi({
  reducerPath: 'permissionsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.securitypass.efbo.ru/' }),
  endpoints: (builder) => ({
    getPermissions: builder.query<TPermissions, string>({
      query: () => `permissions`,
    }),
    postPermissions: builder.mutation<string, IPermissions>({
      query: () => ({ url: `permissions`, method: 'POST' }),
    }),
    deletePermissions: builder.mutation<string, TPermissions>({
      query: (name) => ({ url: `Permissions/${name}`, method: 'DELETE' }),
    }),
  }),
})

export const { useGetPermissionsQuery, usePostPermissionsMutation } = permissionsApi;