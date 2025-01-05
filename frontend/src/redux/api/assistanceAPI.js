import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';

export const assistanceAPI = createApi({
    reducerPath: 'assistanceAPI',
    baseQuery: defaultFetchBase,
    tagTypes: ['Assistance'],
    endpoints: (builder) => ({
        createAssistance: builder.mutation({
            query(assistance) {
                return {
                    url: '/assistances/create',
                    method: 'POST',
                    credentials: 'include',
                    body: assistance,
                };
            },
            invalidatesTags: [{ type: 'Assistance', id: 'LIST' }],
            transformResponse: (result) => result,
        }),
        updateAssistance: builder.mutation({
            query({ id, assistance }) {
                return {
                    url: `/assistances/update/${id}`,
                    method: 'PUT',
                    credentials: 'include',
                    body: assistance,
                };
            },
            invalidatesTags: (result, _error, { id }) =>
                result
                    ? [
                        { type: 'Assistance', id },
                        { type: 'Assistance', id: 'LIST' },
                    ]
                    : [{ type: 'Assistance', id: 'LIST' }],
            transformResponse: (response) => response,
        }),
        getAssistance: builder.query({
            query(id) {
                return {
                    url: `/assistances/${id}`,
                    credentials: 'include',
                };
            },
            providesTags: (_result, _error, id) => [{ type: 'Assistance', id }],
        }),
        getAssistances: builder.query({
            query: () => ({
                url: '/assistances',
                credentials: 'include',
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({ type: 'Assistance', id: _id })),
                        { type: 'Assistance', id: 'LIST' },
                    ]
                    : [{ type: 'Assistance', id: 'LIST' }],
            transformResponse: (response) => response,
        }),
        getMyAssistances: builder.query({
            query: () => ({
                url: '/assistances/my-items',
                credentials: 'include',
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({ type: 'Assistance', id: _id })),
                        { type: 'Assistance', id: 'LIST' },
                    ]
                    : [{ type: 'Assistance', id: 'LIST' }],
            transformResponse: (response) => response,
        }),
        deleteAssistance: builder.mutation({
            query(id) {
                return {
                    url: `/assistances/delete/${id}`,
                    method: 'DELETE',
                    credentials: 'include',
                };
            },
            invalidatesTags: [{ type: 'Assistance', id: 'LIST' }],
        }),
    }),
});

export const {
    useCreateAssistanceMutation,
    useUpdateAssistanceMutation,
    useGetAssistanceQuery,
    useGetAssistancesQuery,
    useDeleteAssistanceMutation,
    useGetMyAssistancesQuery,
} = assistanceAPI;
