// ========================================
// NEWSLETTER FORM CONFIGURATION
// Email newsletter signup form fields
// ========================================

import type { FormConfig } from './types'

/**
 * Newsletter form configuration (minimal)
 */
export const newsletterFormConfig: FormConfig = {
  id: 'newsletter-form',
  enquiryType: 'newsletter_signup',
  submitText: 'Subscribe',
  submittingText: 'Subscribing...',
  successTitle: 'You\'re Subscribed!',
  successMessage: 'Thank you for subscribing. You\'ll receive our latest property updates and market insights.',
  errorMessage: 'Something went wrong. Please try again.',
  honeypot: true,
  fields: [
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email',
      required: true,
      gridColumn: 'full',
      autocomplete: 'email',
    },
  ],
}

/**
 * Newsletter form with name (expanded version)
 */
export const newsletterExpandedFormConfig: FormConfig = {
  id: 'newsletter-expanded-form',
  enquiryType: 'newsletter_signup',
  submitText: 'Subscribe',
  submittingText: 'Subscribing...',
  successTitle: 'You\'re Subscribed!',
  successMessage: 'Thank you for subscribing. You\'ll receive our latest property updates and market insights.',
  errorMessage: 'Something went wrong. Please try again.',
  honeypot: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'First Name',
      placeholder: 'Your first name',
      gridColumn: 'half',
      autocomplete: 'given-name',
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
  ],
}
