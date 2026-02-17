// ========================================
// FORM CONFIGURATIONS INDEX
// Export all form configs and types
// ========================================

// Types
export type {
  FieldType,
  GridColumn,
  SelectOption,
  FieldValidation,
  FieldConfig,
  FormConfig,
  FormProps,
} from './types'

// Contact form
export { contactFormConfig, subjectOptions } from './contact'

// Viewing form
export { viewingFormConfig } from './viewing'

// Valuation form
export {
  valuationFormConfig,
  propertyTypeOptions,
  bedroomOptions,
  valuationReasonOptions,
} from './valuation'

// Newsletter form
export { newsletterFormConfig, newsletterExpandedFormConfig } from './newsletter'
