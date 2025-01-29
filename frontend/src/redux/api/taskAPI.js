import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';

export const taskAPI = createApi({
    reducerPath: 'taskAPI',
    baseQuery: defaultFetchBase,
    tagTypes: ['Tasks'],
    endpoints: (builder) => ({
        // Create Task
        createTask: builder.mutation({
            query(task) {
                return {
                    url: '/tasks/create',
                    method: 'POST',
                    credentials: 'include',
                    body: task,
                };
            },
            invalidatesTags: [{ type: 'Tasks', id: 'LIST' }],
        }),

        // Update Task
        updateTask: builder.mutation({
            query({ id, task }) {
                return {
                    url: `/tasks/update/${id}`,
                    method: 'PUT',
                    credentials: 'include',
                    body: task,
                };
            },
            invalidatesTags: (result, _error, { id }) =>
                result
                    ? [
                        { type: 'Tasks', id },
                        { type: 'Tasks', id: 'LIST' },
                    ]
                    : [{ type: 'Tasks', id: 'LIST' }],
        }),

        // Get a Single Task
        getTask: builder.query({
            query(id) {
                return {
                    url: `/tasks/getOneTask/${id}`,
                    credentials: 'include',
                };
            },
            providesTags: (_result, _error, id) => [{ type: 'Tasks', id }],
        }),

        // Get All Tasks
        getTasks: builder.query({
            query: () => ({
                url: '/tasks',
                credentials: 'include',
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ _id }) => ({ type: 'Tasks', id: _id })),
                        { type: 'Tasks', id: 'LIST' },
                    ]
                    : [{ type: 'Tasks', id: 'LIST' }],
        }),

        // Delete Task
        deleteTask: builder.mutation({
            query(id) {
                return {
                    url: `/tasks/delete/${id}`,
                    method: 'DELETE',
                    credentials: 'include',
                };
            },
            invalidatesTags: [{ type: 'Tasks', id: 'LIST' }],
        }),
    }),
});

export const {
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useGetTaskQuery,
    useGetTasksQuery,
    useDeleteTaskMutation,
} = taskAPI;
