// User field configuration - the single source of truth for extensibility
import { z } from 'zod';

export interface UserFieldConfig {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'select' | 'textarea';
  placeholder?: string;
  required: boolean;
  validation: z.ZodTypeAny;
  defaultValue?: any;
  options?: { value: string; label: string }[]; // For select fields
  gridProps?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
  tableProps?: {
    width?: number;
    sortable?: boolean;
    format?: (value: any) => string;
  };
}

// Central configuration - add new fields here ONLY
export const userFieldsConfig: UserFieldConfig[] = [
  {
    id: 'firstName',
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    placeholder: 'Enter first name',
    required: true,
    validation: z.string().min(1, 'First name is required').min(2, 'First name must be at least 2 characters'),
    defaultValue: '',
    gridProps: { xs: 12, sm: 6 },
    tableProps: { width: 120, sortable: true }
  },
  {
    id: 'lastName',
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    placeholder: 'Enter last name',
    required: true,
    validation: z.string().min(1, 'Last name is required').min(2, 'Last name must be at least 2 characters'),
    defaultValue: '',
    gridProps: { xs: 12, sm: 6 },
    tableProps: { width: 120, sortable: true }
  },
  {
    id: 'email',
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'Enter email address',
    required: true,
    validation: z.string().min(1, 'Email is required').email('Invalid email address'),
    defaultValue: '',
    gridProps: { xs: 12, sm: 6 },
    tableProps: { width: 200, sortable: true }
  },
  {
    id: 'phone',
    name: 'phone',
    label: 'Phone Number',
    type: 'tel',
    placeholder: 'Enter phone number',
    required: true,
    validation: z.string().min(1, 'Phone number is required').regex(/^[+]?[\d\s\-\(\)]+$/, 'Invalid phone number format'),
    defaultValue: '',
    gridProps: { xs: 12, sm: 6 },
    tableProps: { width: 150, sortable: true }
  },
  // Example of how easy it is to add new fields:
  // {
  //   id: 'dateOfBirth',
  //   name: 'dateOfBirth',
  //   label: 'Date of Birth',
  //   type: 'date',
  //   required: false,
  //   validation: z.string().optional(),
  //   defaultValue: '',
  //   gridProps: { xs: 12, sm: 6 },
  //   tableProps: { width: 120, sortable: true, format: (value) => new Date(value).toLocaleDateString() }
  // },
  // {
  //   id: 'role',
  //   name: 'role',
  //   label: 'Role',
  //   type: 'select',
  //   required: true,
  //   validation: z.enum(['admin', 'user', 'manager']),
  //   defaultValue: 'user',
  //   options: [
  //     { value: 'admin', label: 'Administrator' },
  //     { value: 'user', label: 'User' },
  //     { value: 'manager', label: 'Manager' }
  //   ],
  //   gridProps: { xs: 12, sm: 6 },
  //   tableProps: { width: 120, sortable: true }
  // }
];

// Generate Zod schema dynamically from configuration
export const userValidationSchema = z.object(
  userFieldsConfig.reduce((acc, field) => {
    if (field.required) {
      acc[field.name] = field.validation;
    } else {
      acc[field.name] = field.validation.optional();
    }
    return acc;
  }, {} as Record<string, z.ZodTypeAny>)
);

// Generate TypeScript type from configuration
export type User = z.infer<typeof userValidationSchema> & {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
};

// Generate default form values
export const getDefaultFormValues = (): Partial<User> => {
  return userFieldsConfig.reduce((acc, field) => {
    acc[field.name] = field.defaultValue || '';
    return acc;
  }, {} as Partial<User>);
};
