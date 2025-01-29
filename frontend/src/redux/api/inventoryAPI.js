import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';

export const inventoryAPI = createApi({
    reducerPath: 'inventoryAPI',
    baseQuery: defaultFetchBase,
    tagTypes: ['Inventory'],
    endpoints: (builder) => ({
        getInventories: builder.query({
            query: () => ({
                url: '/inventories',
                credentials: 'include',
            }),
            providesTags: (_result, _error, id) => [{ type: 'Inventory', id }],
            transformResponse: (response) => response,
        }),
        getInventoriyItems: builder.query({
            query: () => ({
                url: '/inventories/items',
                credentials: 'include',
            }),
            providesTags: (_result, _error, id) => [{ type: 'Inventory', id }],
            transformResponse: (response) => response,
        }),
    }),
});

export const {
    useGetInventoriesQuery,
    useGetInventoriyItemsQuery
} = inventoryAPI;
