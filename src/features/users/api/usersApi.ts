import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User } from '../config/userFieldsConfig';

// Mock data for deployment
const mockUsers: User[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z"
  },
  {
    id: 2,
    firstName: "Janet",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    updatedAt: "2026-02-10T11:07:42.535Z",
  },
  {
    id: 4,
    firstName: "Alex",
    lastName: "Pereira",
    email: "alex@chama.com",
    phone: "7777777777",
    createdAt: "2026-02-10T11:10:11.558Z",
    updatedAt: "2026-02-10T11:10:11.558Z",
  }
];

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
        // Use mock data in production, real data in development
        if (import.meta.env.DEV) {
          return response.sort((a, b) => 
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          );
        }
        return mockUsers.sort((a, b) => 
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
      query: (newUserData) => ({
        url: 'users',
        method: 'POST',
        body: {
          ...newUserData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: ['User'], // Invalidate cache to refetch
    }),

    // UPDATE - Update existing user
    updateUser: builder.mutation<User, { id: number; updates: Partial<User> }>({
      query: (userData) => ({
        url: `users/${userData.id}`,
        method: 'PUT',
        body: {
          ...userData.updates,
          updatedAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'User', id }],
    }),

    // DELETE - Remove user
    deleteUser: builder.mutation<void, number>({
      query: (userId) => ({
        url: `users/${userId}`,
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
