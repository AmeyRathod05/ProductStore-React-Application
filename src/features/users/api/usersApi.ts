import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User } from '../config/userFieldsConfig';

// Define API slice with TypeScript
export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.DEV 
      ? 'http://localhost:3001/api' 
      : '/api', // Production API URL
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User'], // For cache invalidation
  endpoints: (builder) => ({
    // READ - Get all users
    getUsers: builder.query<User[], void>({
      query: () => 'users',
      providesTags: ['User'], // Cache this data
      transformResponse: (response: User[]) => {
        // Sort by creation date if available
        return response.sort((a, b) => 
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
      },
    }),

    // READ - Get single user
    getUser: builder.query<User, number>({
      query: (id) => `users/${id}`,
      providesTags: (_, __, id) => [{ type: 'User', id }],
    }),

    // CREATE - Add new user
    createUser: builder.mutation<User, Partial<User>>({
      query: (newUser) => ({
        url: 'users',
        method: 'POST',
        body: {
          ...newUser,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: ['User'], // Invalidate cache to refetch
    }),

    // UPDATE - Update existing user
    updateUser: builder.mutation<User, { id: number; updates: Partial<User> }>({
      query: ({ id, updates }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body: {
          ...updates,
          updatedAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'User', id }],
    }),

    // DELETE - Remove user
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'], // Invalidate cache to refetch
    }),
  }),
});

// Export hooks for easy usage
export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
