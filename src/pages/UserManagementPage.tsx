import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  Snackbar,
  Alert,
  Fab,
  Container,
  Typography,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useGetUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } from '../features/users/api/usersApi';
import { userValidationSchema, getDefaultFormValues, type User } from '../features/users/config/userFieldsConfig';
import { ExtensibleFormField, ExtensibleForm } from '../features/users/components/ExtensibleForm';
import { ExtensibleTable } from '../features/users/components/ExtensibleTable';
import { userFieldsConfig } from '../features/users/config/userFieldsConfig';

type UserFormData = User;

const UserManagementPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // RTK Query hooks
  const { data: users = [], isLoading, error, refetch } = useGetUsersQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  // Form setup
  const methods = useForm<UserFormData>({
    resolver: zodResolver(userValidationSchema),
    defaultValues: getDefaultFormValues(),
    mode: 'onChange',
  });

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      methods.reset(user);
    } else {
      setEditingUser(null);
      methods.reset(getDefaultFormValues());
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
    methods.reset();
  };

  const handleSubmit = async (data: UserFormData) => {
    try {
      if (editingUser) {
        await updateUser({ id: editingUser.id!, updates: data }).unwrap();
        showSnackbar('User updated successfully', 'success');
      } else {
        await createUser(data).unwrap();
        showSnackbar('User created successfully', 'success');
      }
      
      handleCloseDialog();
      refetch(); // Refresh the users list
    } catch (error: any) {
      showSnackbar(
        error?.data?.message || `Failed to ${editingUser ? 'update' : 'create'} user`,
        'error'
      );
    }
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId).unwrap();
        showSnackbar('User deleted successfully', 'success');
        refetch(); // Refresh the users list
      } catch (error: any) {
        showSnackbar(
          error?.data?.message || 'Failed to delete user',
          'error'
        );
      }
    }
  };

  const handleView = (user: User) => {
    // For now, just show user info in an alert
    const userInfo = userFieldsConfig
      .map((field: any) => `${field.label}: ${user[field.name as keyof User] || '-'}`)
      .join('\n');
    
    alert(`User Details:\n${userInfo}`);
  };

  const isFormLoading = isCreating || isUpdating;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          disabled={isLoading}
        >
          Add User
        </Button>
      </Box>

      {/* Users Table */}
      <ExtensibleTable
        users={users}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
        onView={handleView}
        loading={isLoading}
      />

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        aria-label="add user"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' }
        }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon />
      </Fab>

      {/* Create/Edit User Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: 400 }
        }}
      >
        <FormProvider {...methods}>
          <ExtensibleForm
            onSubmit={handleSubmit}
            title={editingUser ? 'Edit User' : 'Create New User'}
          >
            {/* Render all fields from configuration */}
            <Box sx={{ mt: 2 }}>
              {userFieldsConfig.map((fieldConfig: any) => (
                <ExtensibleFormField
                  key={fieldConfig.id}
                  fieldConfig={fieldConfig}
                />
              ))}
            </Box>

            <DialogActions sx={{ mt: 3, px: 3, pb: 3 }}>
              <Button onClick={handleCloseDialog} disabled={isFormLoading}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isFormLoading}
                onClick={methods.handleSubmit(handleSubmit)}
              >
                {isFormLoading ? 'Saving...' : (editingUser ? 'Update' : 'Create')}
              </Button>
            </DialogActions>
          </ExtensibleForm>
        </FormProvider>
      </Dialog>

      {/* Success/Error Messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Error State */}
      {error && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">
            Failed to load users. Please try again later.
          </Alert>
        </Box>
      )}
    </Container>
  );
};

export default UserManagementPage;
