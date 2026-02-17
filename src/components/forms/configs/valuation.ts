// ========================================
// VALUATION REQUEST FORM CONFIGURATION
// Property valuation request form fields
// ========================================

import type { FormConfig } from './types'

/**
 * Property type options
 */
export const propertyTypeOptions = [
  { value: '', label: 'Select property type...' },
  { value: 'house', label: 'House' },
  { value: 'flat', label: 'Flat/Apartment' },
  { value: 'bungalow', label: 'Bungalow' },
  { value: 'terraced', label: 'Terraced House' },
  { value: 'semi-detached', label: 'Semi-Detached' },
  { value: 'detached', label: 'Detached House' },
  { value: 'maisonette', label: 'Maisonette' },
  { value: 'other', label: 'Other' },
]

/**
 * Bedroom count options
 */
export const bedroomOptions = [
  { value: '', label: 'Select...' },
  { value: 'studio', label: 'Studio' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6+', label: '6+' },
]

/**
 * Valuation reason options
 */
export const valuationReasonOptions = [
  { value: '', label: 'Select reason...' },
  { value: 'selling', label: 'Planning to sell' },
  { value: 'letting', label: 'Planning to let' },
  { value: 'curious', label: 'Just curious' },
  { value: 'remortgage', label: 'Remortgage' },
  { value: 'inheritance', label: 'Inheritance/Probate' },
  { value: 'divorce', label: 'Divorce/Separation' },
  { value: 'other', label: 'Other' },
]

/**
 * Valuation form configuration
 */
export const valuationFormConfig: FormConfig = {
  id: 'valuation-form',
  enquiryType: 'valuation_request',
  submitText: 'Get Free Valuation',
  submittingText: 'Submitting...',
  successTitle: 'Valuation Request Received!',
  successMessage: 'One of our local experts will be in touch within 24 hours with your property valuation.',
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
      required: true,
      gridColumn: 'half',
      autocomplete: 'tel',
    },
    {
      name: 'postcode',
      type: 'text',
      label: 'Property Postcode',
      placeholder: 'e.g. SW1A 1AA',
      required: true,
      gridColumn: 'half',
      autocomplete: 'postal-code',
    },
    {
      name: 'address',
      type: 'text',
      label: 'Property Address',
      placeholder: 'First line of address',
      required: true,
      gridColumn: 'full',
      autocomplete: 'street-address',
    },
    {
      name: 'property_type',
      type: 'select',
      label: 'Property Type',
      required: true,
      gridColumn: 'half',
      options: propertyTypeOptions,
    },
    {
      name: 'bedrooms',
      type: 'select',
      label: 'Bedrooms',
      required: true,
      gridColumn: 'half',
      options: bedroomOptions,
    },
    {
      name: 'reason',
      type: 'select',
      label: 'Reason for Valuation',
      gridColumn: 'full',
      options: valuationReasonOptions,
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Additional Information',
      placeholder: 'Tell us about any recent improvements or special features...',
      gridColumn: 'full',
      validation: {
        maxLength: 1000,
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
