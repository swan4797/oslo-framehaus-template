// ========================================
// VIEWING REQUEST FORM CONFIGURATION
// Property viewing request form fields
// ========================================

import type { FormConfig } from './types'

/**
 * Viewing form configuration
 */
export const viewingFormConfig: FormConfig = {
  id: 'viewing-form',
  enquiryType: 'viewing_request',
  submitText: 'Request Viewing',
  submittingText: 'Sending...',
  successTitle: 'Viewing Request Sent!',
  successMessage: 'We\'ll be in touch shortly to confirm your appointment.',
  errorMessage: 'Something went wrong. Please try again or call us directly.',
  honeypot: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Your full name',
      required: true,
      gridColumn: 'full',
      autocomplete: 'name',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'you@example.com',
      required: true,
      gridColumn: 'half',
      autocomplete: 'email',
    },
    {
      name: 'phone',
      type: 'tel',
      label: 'Phone',
      placeholder: '07123 456789',
      required: true,
      gridColumn: 'half',
      autocomplete: 'tel',
    },
    {
      name: 'preferred_date',
      type: 'date',
      label: 'Preferred Date',
      gridColumn: 'full',
    },
    {
      name: 'preferred_time',
      type: 'time-picker',
      label: 'Preferred Time',
      gridColumn: 'full',
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Additional Information',
      placeholder: 'Any questions or special requirements for your viewing?',
      gridColumn: 'full',
      validation: {
        maxLength: 1000,
      },
    },
    {
      name: 'marketing_opt_in',
      type: 'checkbox',
      label: 'Keep me updated with similar properties and market news',
      gridColumn: 'full',
    },
  ],
}
