// ========================================
// BRAND SETTINGS CLIENT
// Follows same pattern as api.ts
// ========================================

import { apiConfig } from './config'
import type { BrandSettings, BrandResponse, BrandError } from '../types/brand'

// Cache for brand settings
let brandSettingsCache: BrandSettings | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 1000 // 10 seconds for development

// ========================================
// BRAND API CLIENT
// ========================================

class BrandApiClient {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = `${apiConfig.baseUrl}${apiConfig.functionsPath}`
    this.apiKey = apiConfig.apiKey
  }

  /**
   * Get common headers for all requests
   */
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
    }
  }

  /**
   * Fetch brand settings from API
   */
  async getBrandSettings(forceRefresh: boolean = false): Promise<BrandSettings> {
    // Return cached data if valid
    if (
      !forceRefresh &&
      brandSettingsCache &&
      Date.now() - cacheTimestamp < CACHE_DURATION
    ) {
      console.log('[Brand] Using cached brand settings')
      return brandSettingsCache
    }

    try {
      console.log('[Brand] Fetching brand settings from API')

      const response = await fetch(`${this.baseUrl}/get-brand-settings`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[Brand] Request failed:', errorText)
        throw new Error(`HTTP ${response.status}`)
      }

      const result: BrandResponse = await response.json()

      if (!result.success || !result.data) {
        throw new Error('Invalid response from brand settings API')
      }

      // Update cache
      brandSettingsCache = result.data
      cacheTimestamp = Date.now()

      console.log('[Brand] Brand settings fetched successfully')

      return result.data
    } catch (error) {
      console.error('[Brand] Error fetching brand settings:', error)
      return getDefaultBrandSettings()
    }
  }

  /**
   * Clear brand settings cache
   */
  clearCache(): void {
    brandSettingsCache = null
    cacheTimestamp = 0
    console.log('[Brand] Brand settings cache cleared')
  }
}

// ========================================
// EXPORT SINGLETON INSTANCE
// ========================================

const brandApi = new BrandApiClient()

// ========================================
// CONVENIENCE FUNCTIONS
// ========================================

/**
 * Fetch brand settings from API
 * Includes caching to prevent excessive API calls
 */
export async function fetchBrandSettings(
  forceRefresh: boolean = false
): Promise<BrandSettings> {
  return brandApi.getBrandSettings(forceRefresh)
}

/**
 * Default JSONB colors structure
 */
export const defaultColors = {
  brand: { primary: '#3c5b4b', secondary: '#f6f4f4', accent: '#10b981' },
  text: { primary: '#1f2937', secondary: '#6b7280', muted: '#9ca3af', light: '#ffffff' },
  background: { primary: '#ffffff', secondary: '#f9fafb', tertiary: '#f3f4f6', dark: '#111827' },
  border: { light: '#e5e7eb', medium: '#d1d5db', dark: '#9ca3af' },
  state: { success: '#10b981', warning: '#f59e0b', error: '#ef4444', info: '#3b82f6' },
  button: {
    primary: { default: '#3c5b4b', hover: '#2d4639', active: '#243a2e', dark: '#1a2b22', light: '#4a6d5c' },
    secondary: { default: '#f6f4f4', hover: '#ebe8e8', active: '#e0dcdc', dark: '#d5d0d0', light: '#fafafa' },
    text: { primary: '#ffffff', secondary: '#1f2937' }
  },
  link: { default: '#3c5b4b', hover: '#2d4639', active: '#243a2e', visited: '#4a6d5c', dark: '#1a2b22', light: '#5a7d6c' },
  email: {
    primary: '#3c5b4b', secondary: '#f6f4f4', buttonBg: '#3c5b4b', buttonText: '#ffffff',
    headerBg: '#3c5b4b', headerText: '#ffffff', footerBg: '#f6f4f4', footerText: '#1f2937', link: '#3c5b4b'
  }
}

/**
 * Get default brand settings (fallback)
 */
export function getDefaultBrandSettings(): BrandSettings {
  return {
    business_name: 'Your Estate Agency',
    tagline: '',
    colors: defaultColors,
    heading_font_family: 'Garet',
    body_font_family: 'Inter',
    heading_font_weight: '700',
    body_font_weight: '400',
    border_radius: 'medium',
    button_style: 'solid',
    shadow_intensity: 'medium',
    show_testimonials: true,
    show_team_section: true,
    show_contact_form: true,
    show_property_search: true,
    is_default: true,
  }
}

/**
 * Clear brand settings cache
 * Useful when you know settings have changed
 */
export function clearBrandCache(): void {
  brandApi.clearCache()
}

/**
 * Get cached brand settings (synchronous)
 * Returns null if no cache available
 */
export function getCachedBrandSettings(): BrandSettings | null {
  if (brandSettingsCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return brandSettingsCache
  }
  return null
}

// ========================================
// CSS GENERATION HELPERS
// ========================================

/**
 * Convert hex color to RGB values string
 */
export function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '0, 0, 0'
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}

/**
 * Darken a hex color by a percentage
 */
export function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.max((num >> 16) - amt, 0)
  const G = Math.max(((num >> 8) & 0x00ff) - amt, 0)
  const B = Math.max((num & 0x0000ff) - amt, 0)
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}

/**
 * Lighten a hex color by a percentage
 */
export function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.min((num >> 16) + amt, 255)
  const G = Math.min(((num >> 8) & 0x00ff) + amt, 255)
  const B = Math.min((num & 0x0000ff) + amt, 255)
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`
}

/**
 * Get border radius CSS value from setting
 */
export function getBorderRadiusValue(setting: string): string {
  const map: Record<string, string> = {
    none: '0',
    small: '4px',
    medium: '8px',
    large: '16px',
    full: '9999px',
  }
  return map[setting] || map.medium
}

/**
 * Get shadow CSS value from setting
 */
export function getShadowValue(setting: string): string {
  const map: Record<string, string> = {
    none: 'none',
    small: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03)',
    large: '0 10px 25px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.04)',
  }
  return map[setting] || map.medium
}

/**
 * Generate CSS variables from brand settings
 * Connects to the token system in /styles/tokens/
 */
export function generateCssVariables(brand: BrandSettings): string {
  // Merge with defaults to handle partial colors objects
  const colors = {
    brand: { ...defaultColors.brand, ...brand.colors?.brand },
    text: { ...defaultColors.text, ...brand.colors?.text },
    background: { ...defaultColors.background, ...brand.colors?.background },
    border: { ...defaultColors.border, ...brand.colors?.border },
    state: { ...defaultColors.state, ...brand.colors?.state },
    button: {
      primary: { ...defaultColors.button.primary, ...brand.colors?.button?.primary },
      secondary: { ...defaultColors.button.secondary, ...brand.colors?.button?.secondary },
      text: { ...defaultColors.button.text, ...brand.colors?.button?.text },
    },
    link: { ...defaultColors.link, ...brand.colors?.link },
    email: { ...defaultColors.email, ...brand.colors?.email },
  }

  const primaryDark = darkenColor(colors.brand.primary, 10)
  const primaryLight = lightenColor(colors.brand.primary, 10)

  // Generate state color variants
  const successLight = lightenColor(colors.state.success, 85)
  const successLighter = lightenColor(colors.state.success, 75)
  const successBorder = lightenColor(colors.state.success, 50)
  const successDark = darkenColor(colors.state.success, 30)

  const warningLight = lightenColor(colors.state.warning, 80)
  const warningLighter = lightenColor(colors.state.warning, 70)
  const warningBorder = lightenColor(colors.state.warning, 40)
  const warningDark = darkenColor(colors.state.warning, 30)

  const errorLight = lightenColor(colors.state.error, 85)
  const errorLighter = lightenColor(colors.state.error, 75)
  const errorBorder = lightenColor(colors.state.error, 50)
  const errorDark = darkenColor(colors.state.error, 30)

  const infoLight = lightenColor(colors.state.info, 85)
  const infoLighter = lightenColor(colors.state.info, 75)
  const infoBorder = lightenColor(colors.state.info, 50)
  const infoDark = darkenColor(colors.state.info, 30)

  // Generate dark background tiers
  const bgDarkHero = darkenColor(colors.background.dark, 5)
  const bgDarkInfo = darkenColor(colors.background.dark, 15)
  const bgDarkBottom = darkenColor(colors.background.dark, 20)

  return `
    /* Brand Colors - Dynamic from Stratos CRM */
    --color-primary: ${colors.brand.primary};
    --color-primary-dark: ${primaryDark};
    --color-primary-light: ${primaryLight};
    --color-secondary: ${colors.brand.secondary};
    --color-accent: ${colors.brand.accent};

    /* Text Colors */
    --color-text-primary: ${colors.text.primary};
    --color-text-secondary: ${colors.text.secondary};
    --color-text-muted: ${colors.text.muted};
    --color-text-light: ${colors.text.light};

    /* Background Colors */
    --color-bg-primary: ${colors.background.primary};
    --color-bg-secondary: ${colors.background.secondary};
    --color-bg-tertiary: ${colors.background.tertiary};
    --color-bg-dark: ${colors.background.dark};

    /* Dark Background Tiers (for footer sections) */
    --color-bg-dark-hero: ${bgDarkHero};
    --color-bg-dark-info: ${bgDarkInfo};
    --color-bg-dark-bottom: ${bgDarkBottom};

    /* Border Colors */
    --color-border-light: ${colors.border.light};
    --color-border-medium: ${colors.border.medium};
    --color-border-dark: ${colors.border.dark};

    /* Button Colors - Primary */
    --color-button-primary: ${colors.button.primary.default};
    --color-button-primary-hover: ${colors.button.primary.hover};
    --color-button-primary-active: ${colors.button.primary.active};
    --color-button-primary-dark: ${colors.button.primary.dark};
    --color-button-primary-light: ${colors.button.primary.light};

    /* Button Colors - Secondary */
    --color-button-secondary: ${colors.button.secondary.default};
    --color-button-secondary-hover: ${colors.button.secondary.hover};
    --color-button-secondary-active: ${colors.button.secondary.active};
    --color-button-secondary-dark: ${colors.button.secondary.dark};
    --color-button-secondary-light: ${colors.button.secondary.light};

    /* Button Text Colors */
    --color-button-text-primary: ${colors.button.text.primary};
    --color-button-text-secondary: ${colors.button.text.secondary};

    /* Link Colors */
    --color-link: ${colors.link.default};
    --color-link-hover: ${colors.link.hover};
    --color-link-active: ${colors.link.active};
    --color-link-visited: ${colors.link.visited};
    --color-link-dark: ${colors.link.dark};
    --color-link-light: ${colors.link.light};

    /* RGB versions for rgba() usage */
    --color-primary-rgb: ${hexToRgb(colors.brand.primary)};
    --color-secondary-rgb: ${hexToRgb(colors.brand.secondary)};
    --color-accent-rgb: ${hexToRgb(colors.brand.accent)};
    --color-text-primary-rgb: ${hexToRgb(colors.text.primary)};
    --color-text-light-rgb: ${hexToRgb(colors.text.light)};
    --color-bg-primary-rgb: ${hexToRgb(colors.background.primary)};
    --color-bg-dark-rgb: ${hexToRgb(colors.background.dark)};
    --color-success-rgb: ${hexToRgb(colors.state.success)};
    --color-warning-rgb: ${hexToRgb(colors.state.warning)};
    --color-error-rgb: ${hexToRgb(colors.state.error)};
    --color-info-rgb: ${hexToRgb(colors.state.info)};

    /* State Colors */
    --color-success: ${colors.state.success};
    --color-success-light: ${successLight};
    --color-success-lighter: ${successLighter};
    --color-success-border: ${successBorder};
    --color-success-dark: ${successDark};

    --color-warning: ${colors.state.warning};
    --color-warning-light: ${warningLight};
    --color-warning-lighter: ${warningLighter};
    --color-warning-border: ${warningBorder};
    --color-warning-dark: ${warningDark};

    --color-error: ${colors.state.error};
    --color-error-light: ${errorLight};
    --color-error-lighter: ${errorLighter};
    --color-error-border: ${errorBorder};
    --color-error-dark: ${errorDark};

    --color-info: ${colors.state.info};
    --color-info-light: ${infoLight};
    --color-info-lighter: ${infoLighter};
    --color-info-border: ${infoBorder};
    --color-info-dark: ${infoDark};

    /* Typography */
    --font-family-heading: '${brand.heading_font_family}', system-ui, -apple-system, sans-serif;
    --font-family-body: '${brand.body_font_family}', system-ui, -apple-system, sans-serif;
    --font-weight-heading: ${brand.heading_font_weight};
    --font-weight-body: ${brand.body_font_weight};

    /* Effects - Dynamic from brand settings */
    --radius-brand: ${getBorderRadiusValue(brand.border_radius)};
    --shadow-brand: ${getShadowValue(brand.shadow_intensity)};

    /* Legacy aliases for backwards compatibility */
    --brand-primary: ${colors.brand.primary};
    --brand-secondary: ${colors.brand.secondary};
    --brand-accent: ${colors.brand.accent};
  `.trim()
}

/**
 * Get Google Fonts URL for brand fonts
 */
export function getGoogleFontsUrl(brand: BrandSettings): string {
  const fonts = new Set([brand.heading_font_family, brand.body_font_family])
  const fontParams = Array.from(fonts)
    .filter(f => f && f !== 'system-ui' && f !== 'Inter')
    .map(f => `family=${encodeURIComponent(f)}:wght@300;400;500;600;700;800`)
    .join('&')

  if (!fontParams) return ''
  return `https://fonts.googleapis.com/css2?${fontParams}&display=swap`
}
/**
 * Get contact information from brand settings
 */
export function getContactInfo(brand: BrandSettings) {
    const addressParts = [
      brand.contact_address_line_1,
      brand.contact_address_line_2,
      brand.contact_city,
      brand.contact_postcode,
    ].filter(Boolean)
  
    return {
      email: brand.contact_email || '',
      phone: brand.contact_phone || '',
      address: addressParts.join(', '),
      addressLines: addressParts,
    }
  }
  
  /**
   * Get social media links from brand settings
   */
  export function getSocialLinks(brand: BrandSettings) {
    return {
      facebook: brand.facebook_url || null,
      twitter: brand.twitter_url || null,
      instagram: brand.instagram_url || null,
      linkedin: brand.linkedin_url || null,
      youtube: brand.youtube_url || null,
      tiktok: brand.tiktok_url || null,
    }
  }
  
  /**
   * Check if a feature is enabled
   */
  export function isFeatureEnabled(
    brand: BrandSettings,
    feature: 'show_testimonials' | 'show_team_section' | 'show_contact_form' | 'show_property_search'
  ): boolean {
    return brand[feature] ?? false
  }