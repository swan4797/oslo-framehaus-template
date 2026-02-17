// ========================================
// HEADER CONFIGURATION
// ========================================

import type { HeaderVariant, HeaderVariantConfig, NavItem } from './types'

// ========================================
// VARIANT PRESETS
// Predefined configurations for common use cases
// ========================================

export const variantPresets: Record<HeaderVariant, HeaderVariantConfig> = {
  transparent: {
    background: 'transparent',
    textColor: 'var(--color-text-light-90)',
    textHover: 'var(--color-accent)',
    borderColor: 'transparent',
    lightLogo: true,
    scrolledBackground: 'var(--color-bg-primary-98)',
    scrolledBlur: true,
  },
  solid: {
    background: 'var(--color-bg-primary)',
    textColor: 'var(--color-text-primary)',
    textHover: 'var(--color-accent)',
    borderColor: 'var(--color-border-light)',
    lightLogo: false,
    scrolledBackground: 'var(--color-bg-primary)',
    scrolledBlur: false,
  },
  dark: {
    background: 'var(--color-bg-dark)',
    textColor: 'var(--color-text-light-90)',
    textHover: 'var(--color-text-light)',
    borderColor: 'var(--color-border-dark)',
    lightLogo: true,
    scrolledBackground: 'var(--color-bg-dark-95)',
    scrolledBlur: true,
  },
  minimal: {
    background: 'transparent',
    textColor: 'var(--color-text-primary)',
    textHover: 'var(--color-primary)',
    borderColor: 'transparent',
    lightLogo: false,
    scrolledBackground: 'var(--color-bg-primary)',
    scrolledBlur: false,
  },
}

// ========================================
// DEFAULT NAVIGATION
// ========================================

export const defaultNavItems: NavItem[] = [
  { label: 'For Sale', href: '/search?listing_type=sale' },
  { label: 'To Rent', href: '/search?listing_type=let' },
  {
    label: 'Services',
    href: '#',
    dropdown: [
      { label: 'Sellers', href: '/sellers', description: 'Sell your property' },
      { label: 'Buyers', href: '/buyers', description: 'Find your perfect home' },
      { label: 'Landlords', href: '/landlords', description: 'Letting & management' },
      { label: 'Tenants', href: '/tenants', description: 'Rental properties' },
    ]
  },
  {
    label: 'About',
    href: '/about',
    dropdown: [
      { label: 'About Us', href: '/about', description: 'Learn more about us' },
      { label: 'Our Team', href: '/team', description: 'Meet the team' },
      { label: 'Blog', href: '/blog', description: 'News & insights' },
    ]
  },
  { label: 'Branch', href: '/branches' },
  { label: 'Areas', href: '/areas' },
  { label: 'Contact', href: '/contact' },
]

// ========================================
// NAV HOVER DESCRIPTIONS
// Short summaries displayed on hover
// ========================================

export const navDescriptions: Record<string, string> = {
  'For Sale': 'Discover your dream home from our curated collection of properties.',
  'To Rent': 'Find the perfect rental property tailored to your lifestyle.',
  'Services': 'Expert guidance for buyers, sellers, landlords and tenants.',
  'About': 'Learn about our story, values and the team behind it all.',
  'Branch': 'Visit us at one of our local branches for personalized service.',
  'Areas': 'Explore the neighborhoods and communities we proudly serve.',
  'Contact': 'Get in touch — we\'re here to help with your property journey.',
}

// ========================================
// DEFAULT TAGLINE
// ========================================

export const defaultTagline = 'The Club that makes your life richer.'
