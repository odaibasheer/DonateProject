import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';

export const userAPI = createApi({
    reducerPath: 'userAPI',
    baseQuery: defaultFetchBase,
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        createUser: builder.mutation({
            query(user) {
                return {
                    url: '/users/create',
                    method: 'POST',
                    credentials: 'include',
                    body: user,
                };
            },
            invalidatesTags: [{ type: 'Users', id: 'LIST' }],
            transformResponse: (result) => result,
        }),
        updateUser: builder.mutation({
            query({id, user}) {
                return {
                    url: `/users/update/${id}`,
                    method: 'PUT',
                    credentials: 'include',
                    body: user,
                };
            },
            invalidatesTags: (result, _error, { id }) =>
                result
                    ? [
                        { type: 'Users', id },
                        { type: 'Users', id: 'LIST' },
                    ]
                    : [{ type: 'Users', id: 'LIST' }],
            transformResponse: (response) => response,
        }),

        updateProfile: builder.mutation({
            query(user) {
                return {
                    url: `/users/updateProfile`,
                    method: 'PUT',
                    credentials: 'include',
                    body: user,
                };
            },
            invalidatesTags: (result, _error, { id }) =>
                result
                    ? [
                        { type: 'Users', id },
                        { type: 'Users', id: 'LIST' },
                    ]
                    : [{ type: 'Users', id: 'LIST' }],
            transformResponse: (response) => response,
        }),

        getUser: builder.query({
            query(id) {
                return {
                    url: `/users/getOneUser/${id}`,
                    credentials: 'include',
                };
            },
            providesTags: (_result, _error, id) => [{ type: 'Users', id }],
        }),

        getUsers: builder.query({
            query: (params) => ({
                url: '/users',
                params,
                credentials: 'include',
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ _id }) => ({ type: 'Users', id: _id })),
                          { type: 'Users', id: 'LIST' },
                      ]
                    : [{ type: 'Users', id: 'LIST' }],
            transformResponse: (response) => response.users,
        }),

        getContactUsers: builder.query({
            query: (params) => ({
                url: '/users/contacts',
                params,
                credentials: 'include',
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ _id }) => ({ type: 'Users', id: _id })),
                          { type: 'Users', id: 'LIST' },
                      ]
                    : [{ type: 'Users', id: 'LIST' }],
            transformResponse: (response) => response,
        }),
        
        getProfile: builder.query({
            query() {
                return {
                    url: `/users/getProfile`,
                    credentials: 'include',
                };
            },
            providesTags: (_result, _error, id) => [{ type: 'Users', id }],
        }),
        deleteUser: builder.mutation({
            query(id) {
                return {
                    url: `/users/delete/${id}`,
                    method: 'Delete',
                    credentials: 'include',
                };
            },
            invalidatesTags: [{ type: 'Users', id: 'LIST' }],
        }),
    }),
});

export const {
    useCreateUserMutation,
    useDeleteUserMutation,
    useUpdateUserMutation,
    useGetUserQuery,
    useGetUsersQuery,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useGetContactUsersQuery,
} = userAPI;
