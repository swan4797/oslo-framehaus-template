// ========================================
// FORM CONFIGURATION TYPES
// Centralized type definitions for the form system
// ========================================

/**
 * Field type options for form fields
 */
export type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'date'
  | 'time-picker'
  | 'hidden'

/**
 * Grid column options for field layout
 */
export type GridColumn = 'full' | 'half'

/**
 * Select/dropdown option
 */
export interface SelectOption {
  value: string
  label: string
}

/**
 * Validation rules for a field
 */
export interface FieldValidation {
  pattern?: string
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
}

/**
 * Configuration for a single form field
 */
export interface FieldConfig {
  /** Unique field name (used as form input name) */
  name: string
  /** Field type determines the input component rendered */
  type: FieldType
  /** Display label for the field */
  label: string
  /** Placeholder text */
  placeholder?: string
  /** Whether the field is required */
  required?: boolean
  /** Options for select/radio fields */
  options?: SelectOption[]
  /** Grid column span (full or half width) */
  gridColumn?: GridColumn
  /** Validation rules */
  validation?: FieldValidation
  /** HTML autocomplete attribute */
  autocomplete?: string
  /** Default value */
  defaultValue?: string | number | boolean
  /** Help text displayed below the field */
  hint?: string
}

/**
 * Configuration for a complete form
 */
export interface FormConfig {
  /** Unique form identifier */
  id: string
  /** API endpoint for form submission */
  endpoint?: string
  /** Enquiry type sent to backend */
  enquiryType: string
  /** Form fields configuration */
  fields: FieldConfig[]
  /** Submit button text */
  submitText: string
  /** Text shown while submitting */
  submittingText?: string
  /** Success message after submission */
  successMessage: string
  /** Success message title */
  successTitle?: string
  /** Error message on submission failure */
  errorMessage?: string
  /** URL to redirect to after successful submission */
  redirectUrl?: string
  /** Whether to include honeypot field for spam prevention */
  honeypot?: boolean
  /** Custom CSS class for the form */
  className?: string
}

/**
 * Props passed to Form component
 */
export interface FormProps {
  /** Form configuration */
  config: FormConfig
  /** Property ID for property-related forms */
  propertyId?: string
  /** Additional hidden fields */
  hiddenFields?: Record<string, string>
  /** Custom CSS class */
  class?: string
  /** Override success redirect URL */
  successRedirect?: string
}
