/* eslint-disable no-undef */
import { createApi } from '@reduxjs/toolkit/query/react';
import defaultFetchBase from './defaultFetchBase';

export const contactAPI = createApi({
    reducerPath: 'contactAPI',
    baseQuery: defaultFetchBase,
    tagTypes: ['Contacts'],
    endpoints: (builder) => ({
        getContacts: builder.query({
            query() {
                return {
                    url: `/contacts`,
                    credentials: 'include'
                };
            },
            providesTags: (result, error, id) => {
                return [{ type: 'Contacts', id }];
            },
            transformResponse(result) {
                return result.contacts;
            },
        }),
        selectChat: builder.query({
            query: (args) => {
                return {
                    url: `/contacts/selectChat`,
                    params: { ...args },
                    credentials: 'include'
                };
            },
            providesTags: (result, error, id) => {
                return [{ type: 'Contacts', id }];
            },
            transformResponse(result) {
                return result;
            },
        }),
        createContact: builder.mutation({
            query(payload) {
                return {
                    url: '/contacts/create',
                    method: 'POST',
                    credentials: 'include',
                    body: payload
                };
            },
            invalidatesTags: [{ type: 'Contacts', id: 'LIST' }],
            transformResponse: (result) => result
        }),
        readMessage: builder.mutation({
            query({ contactId, data }) {
                return {
                    url: `/contacts/read/${contactId}`,
                    method: 'PUT',
                    credentials: 'include',
                    body: {
                        client: data
                    }
                };
            },
            invalidatesTags: [{ type: 'Contacts', id: 'LIST' }],
            transformResponse: (result) => result
        }),
        readClientMessage: builder.mutation({
            query({ contactId, data }) {
                return {
                    url: `/contacts/read/${contactId}`,
                    method: 'PUT',
                    credentials: 'include',
                    body: {
                        admin: data
                    }
                };
            },
            invalidatesTags: [{ type: 'Contacts', id: 'LIST' }],
            transformResponse: (result) => result
        })
    })
});

export const { useCreateContactMutation, useGetContactsQuery, useSelectChatQuery, useReadClientMessageMutation, useReadMessageMutation } = contactAPI;
