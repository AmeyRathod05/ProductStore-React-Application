import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import type { User } from '../config/userFieldsConfig';
import { userFieldsConfig } from '../config/userFieldsConfig';

interface ExtensibleTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
  onView: (user: User) => void;
  loading?: boolean;
}

// Extensible table component that renders columns based on configuration
export const ExtensibleTable: React.FC<ExtensibleTableProps> = ({
  users,
  onEdit,
  onDelete,
  onView,
  loading = false,
}) => {
  const getCellValue = (user: User, fieldName: string): React.ReactNode => {
    const value = user[fieldName as keyof User];
    
    // Find the field configuration to apply formatting
    const fieldConfig = userFieldsConfig.find(field => field.name === fieldName);
    
    if (fieldConfig?.tableProps?.format && value) {
      return fieldConfig.tableProps.format(value);
    }
    
    return value?.toString() || '-';
  };

  const renderTableHeader = () => (
    <TableHead>
      <TableRow>
        {userFieldsConfig
          .filter(field => field.tableProps) // Only include fields with table configuration
          .map((field) => (
            <TableCell
              key={field.id}
              sx={{ 
                fontWeight: 'bold',
                minWidth: field.tableProps?.width || 120,
                width: field.tableProps?.width || 120
              }}
            >
              {field.label}
            </TableCell>
          ))}
        <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>
          Actions
        </TableCell>
      </TableRow>
    </TableHead>
  );

  const renderTableBody = () => (
    <TableBody>
      {users.map((user) => (
        <TableRow
          key={user.id}
          sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
        >
          {userFieldsConfig
            .filter(field => field.tableProps) // Only include fields with table configuration
            .map((field) => (
              <TableCell key={field.id}>
                {getCellValue(user, field.name)}
              </TableCell>
            ))}
          <TableCell>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="View Details">
                <IconButton
                  size="small"
                  onClick={() => onView(user)}
                  color="primary"
                >
                  <ViewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Edit User">
                <IconButton
                  size="small"
                  onClick={() => onEdit(user)}
                  color="secondary"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Delete User">
                <IconButton
                  size="small"
                  onClick={() => onDelete(user.id!)}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );

  const renderEmptyState = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
      }}
    >
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No users found
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Create your first user to get started
      </Typography>
    </Box>
  );

  const renderLoadingState = () => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 8,
      }}
    >
      <Typography variant="body1" color="text.secondary">
        Loading users...
      </Typography>
    </Box>
  );

  if (loading) {
    return renderLoadingState();
  }

  if (!users || users.length === 0) {
    return renderEmptyState();
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        {renderTableHeader()}
        {renderTableBody()}
      </Table>
    </TableContainer>
  );
};
