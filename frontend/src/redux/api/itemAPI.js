import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';

export const itemAPI = createApi({
    reducerPath: 'itemAPI',
    baseQuery: defaultFetchBase,
    tagTypes: ['Items'],
    endpoints: (builder) => ({
        createItem: builder.mutation({
            query(item) {
                return {
                    url: '/items/create',
                    method: 'POST',
                    credentials: 'include',
                    body: item,
                };
            },
            invalidatesTags: [{ type: 'Items', id: 'LIST' }],
            transformResponse: (result) => result,
        }),
        updateItem: builder.mutation({
            query({ id, item }) {
                return {
                    url: `/items/update/${id}`,
                    method: 'PUT',
                    credentials: 'include',
                    body: item,
                };
            },
            invalidatesTags: (result, _error, { id }) =>
                result
                    ? [
                        { type: 'Items', id },
                        { type: 'Items', id: 'LIST' },
                    ]
                    : [{ type: 'Items', id: 'LIST' }],
            transformResponse: (response) => response,
        }),
        getItem: builder.query({
            query(id) {
                return {
                    url: `/items/getOneItem/${id}`,
                    credentials: 'include',
                };
            },
            providesTags: (_result, _error, id) => [{ type: 'Items', id }],
        }),
        getItems: builder.query({
            query: () => ({
                url: '/items',
                credentials: 'include',
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({ type: 'Items', id: _id })),
                        { type: 'Items', id: 'LIST' },
                    ]
                    : [{ type: 'Items', id: 'LIST' }],
            transformResponse: (response) => response,
        }),
        getMyItems: builder.query({
            query: () => ({
                url: '/items/my-items',
                credentials: 'include',
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({ type: 'Items', id: _id })),
                        { type: 'Items', id: 'LIST' },
                    ]
                    : [{ type: 'Items', id: 'LIST' }],
            transformResponse: (response) => response,
        }),
        deleteItem: builder.mutation({
            query(id) {
                return {
                    url: `/items/delete/${id}`,
                    method: 'DELETE',
                    credentials: 'include',
                };
            },
            invalidatesTags: [{ type: 'Items', id: 'LIST' }],
        }),
    }),
});

export const {
    useCreateItemMutation,
    useUpdateItemMutation,
    useGetItemQuery,
    useGetItemsQuery,
    useDeleteItemMutation,
    useGetMyItemsQuery,
} = itemAPI;
