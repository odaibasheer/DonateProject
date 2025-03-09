import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';

export const reportAPI = createApi({
    reducerPath: 'reportAPI',
    baseQuery: defaultFetchBase,
    tagTypes: ['Report'],
    endpoints: (builder) => ({
        getAdminReport: builder.query({
            query: () => ({
                url: '/report/admin',
                credentials: 'include',
            }),
            providesTags: (_result, _error, id) => [{ type: 'Report', id }],
            transformResponse: (response) => response,
        }),
    }),
});

export const {
    useGetAdminReportQuery,
} = reportAPI;
