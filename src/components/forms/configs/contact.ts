// ========================================
// CONTACT FORM CONFIGURATION
// General enquiry / contact form fields
// ========================================

import type { FormConfig } from './types'

/**
 * Subject options for contact form
 */
export const subjectOptions = [
  { value: '', label: 'Please select...' },
  { value: 'general_enquiry', label: 'General Question' },
  { value: 'property_enquiry', label: 'Property Enquiry' },
  { value: 'viewing_request', label: 'Request a Viewing' },
  { value: 'valuation_request', label: 'Property Valuation' },
  { value: 'selling_enquiry', label: 'Selling a Property' },
  { value: 'buying_enquiry', label: 'Buying a Property' },
  { value: 'lettings_enquiry', label: 'Lettings Enquiry' },
  { value: 'landlord_enquiry', label: 'Landlord Services' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'other', label: 'Other' },
]

/**
 * Contact form configuration
 */
export const contactFormConfig: FormConfig = {
  id: 'contact-form',
  enquiryType: 'general_enquiry',
  submitText: 'Send Message',
  submittingText: 'Sending...',
  successTitle: 'Message Sent!',
  successMessage: 'Thank you for getting in touch. We\'ll respond within 24 hours.',
  errorMessage: 'Something went wrong. Please try again or call us directly.',
  honeypot: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Your full name',
      required: true,
      gridColumn: 'half',
      autocomplete: 'name',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'you@example.com',
      required: true,
      gridColumn: 'half',
      autocomplete: 'email',
    },
    {
      name: 'phone',
      type: 'tel',
      label: 'Phone Number',
      placeholder: '07123 456789',
      gridColumn: 'half',
      autocomplete: 'tel',
      hint: 'Optional - we\'ll call you back if needed',
    },
    {
      name: 'subject',
      type: 'select',
      label: 'What can we help with?',
      required: true,
      gridColumn: 'half',
      options: subjectOptions,
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Your Message',
      placeholder: 'Tell us how we can help...',
      required: true,
      gridColumn: 'full',
      validation: {
        minLength: 10,
        maxLength: 2000,
      },
    },
    {
      name: 'marketing_opt_in',
      type: 'checkbox',
      label: 'Keep me updated with property news and market insights',
      gridColumn: 'full',
    },
  ],
}
