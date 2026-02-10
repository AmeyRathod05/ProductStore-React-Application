import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Grid,
  Typography,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import type { UserFieldConfig } from '../config/userFieldsConfig';

interface ExtensibleFormFieldProps {
  fieldConfig: UserFieldConfig;
  error?: boolean;
  helperText?: string;
}

// Extensible form field component that renders based on configuration
export const ExtensibleFormField: React.FC<ExtensibleFormFieldProps> = ({
  fieldConfig,
  error,
  helperText,
}) => {
  const { control } = useFormContext();

  const renderField = () => {
    switch (fieldConfig.type) {
      case 'select':
        return (
          <Controller
            name={fieldConfig.name}
            control={control}
            defaultValue={fieldConfig.defaultValue}
            render={({ field: controllerField, fieldState }) => (
              <TextField
                {...controllerField}
                select
                fullWidth
                label={fieldConfig.label}
                placeholder={fieldConfig.placeholder}
                error={error || !!fieldState.error}
                helperText={helperText || fieldState.error?.message}
                required={fieldConfig.required}
                size="medium"
              >
                {fieldConfig.options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        );

      case 'textarea':
        return (
          <Controller
            name={fieldConfig.name}
            control={control}
            defaultValue={fieldConfig.defaultValue}
            render={({ field: controllerField, fieldState }) => (
              <TextField
                {...controllerField}
                fullWidth
                multiline
                rows={4}
                label={fieldConfig.label}
                placeholder={fieldConfig.placeholder}
                error={error || !!fieldState.error}
                helperText={helperText || fieldState.error?.message}
                required={fieldConfig.required}
                size="medium"
              />
            )}
          />
        );

      case 'date':
        return (
          <Controller
            name={fieldConfig.name}
            control={control}
            defaultValue={fieldConfig.defaultValue}
            render={({ field: controllerField, fieldState }) => (
              <TextField
                {...controllerField}
                type="date"
                fullWidth
                label={fieldConfig.label}
                error={error || !!fieldState.error}
                helperText={helperText || fieldState.error?.message}
                required={fieldConfig.required}
                size="medium"
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        );

      case 'tel':
        return (
          <Controller
            name={fieldConfig.name}
            control={control}
            defaultValue={fieldConfig.defaultValue}
            render={({ field: controllerField, fieldState }) => (
              <TextField
                {...controllerField}
                type="tel"
                fullWidth
                label={fieldConfig.label}
                placeholder={fieldConfig.placeholder}
                error={error || !!fieldState.error}
                helperText={helperText || fieldState.error?.message}
                required={fieldConfig.required}
                size="medium"
              />
            )}
          />
        );

      case 'email':
        return (
          <Controller
            name={fieldConfig.name}
            control={control}
            defaultValue={fieldConfig.defaultValue}
            render={({ field: controllerField, fieldState }) => (
              <TextField
                {...controllerField}
                type="email"
                fullWidth
                label={fieldConfig.label}
                placeholder={fieldConfig.placeholder}
                error={error || !!fieldState.error}
                helperText={helperText || fieldState.error?.message}
                required={fieldConfig.required}
                size="medium"
              />
            )}
          />
        );

      case 'text':
      default:
        return (
          <Controller
            name={fieldConfig.name}
            control={control}
            defaultValue={fieldConfig.defaultValue}
            render={({ field: controllerField, fieldState }) => (
              <TextField
                {...controllerField}
                type="text"
                fullWidth
                label={fieldConfig.label}
                placeholder={fieldConfig.placeholder}
                error={error || !!fieldState.error}
                helperText={helperText || fieldState.error?.message}
                required={fieldConfig.required}
                size="medium"
              />
            )}
          />
        );
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      {renderField()}
    </Box>
  );
};

// Extensible form component that renders all fields from configuration
interface ExtensibleFormProps {
  onSubmit: (data: any) => void;
  loading?: boolean;
  title?: string;
  children?: React.ReactNode;
}

export const ExtensibleForm: React.FC<ExtensibleFormProps> = ({
  onSubmit,
  title,
  children,
}) => {
  const { handleSubmit } = useFormContext();

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ width: '100%' }}
    >
      {title && (
        <Typography variant="h5" component="h2" gutterBottom>
          {title}
        </Typography>
      )}
      
      <Grid container spacing={3}>
        {/* Fields will be rendered here by the parent component using ExtensibleFormField */}
      </Grid>

      {children && (
        <Box sx={{ mt: 3 }}>
          {children}
        </Box>
      )}
    </Box>
  );
};
