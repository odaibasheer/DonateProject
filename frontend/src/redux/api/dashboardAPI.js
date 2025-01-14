import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';

export const dashboardAPI = createApi({
    reducerPath: 'dashboardAPI',
    baseQuery: defaultFetchBase,
    tagTypes: ['Dashboard'],
    endpoints: (builder) => ({
        getNeedyDashboard: builder.query({
            query: () => ({
                url: '/dashboards/needy',
                credentials: 'include',
            }),
            providesTags: (_result, _error, id) => [{ type: 'Dashboard', id }],
            transformResponse: (response) => response,
        }),
    }),
});

export const {
    useGetNeedyDashboardQuery,
} = dashboardAPI;
