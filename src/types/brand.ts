// ========================================
// BRAND SETTINGS TYPES
// Type definitions for brand settings
// ========================================

// Button state colors
export interface ButtonStateColors {
  default: string
  hover: string
  active: string
  dark: string
  light: string
}

// JSONB Colors structure
export interface BrandColors {
  brand: {
    primary: string
    secondary: string
    accent: string
  }
  text: {
    primary: string
    secondary: string
    muted: string
    light: string
  }
  background: {
    primary: string
    secondary: string
    tertiary: string
    dark: string
  }
  border: {
    light: string
    medium: string
    dark: string
  }
  state: {
    success: string
    warning: string
    error: string
    info: string
  }
  button: {
    primary: ButtonStateColors
    secondary: ButtonStateColors
    text: {
      primary: string
      secondary: string
    }
  }
  link: {
    default: string
    hover: string
    active: string
    visited: string
    dark: string
    light: string
  }
  email: {
    primary: string
    secondary: string
    buttonBg: string
    buttonText: string
    headerBg: string
    headerText: string
    footerBg: string
    footerText: string
    link: string
  }
}

export interface BrandSettings {
    // Core Identity
    business_name?: string
    tagline?: string
    about_text?: string
    mission_statement?: string
    value_propositions?: string[]

    // Colors (JSONB structure)
    colors: BrandColors
  
    // Typography
    heading_font_family: string
    body_font_family: string
    heading_font_weight: string
    body_font_weight: string
    font_size_base?: number
  
    // Logos & Assets
    logo_main_url?: string | null
    logo_light_url?: string | null
    logo_dark_url?: string | null
    logo_icon_url?: string | null
    favicon_url?: string | null
    hero_background_url?: string | null
    about_image_url?: string | null
    team_image_url?: string | null
  
    // Styling
    border_radius: 'none' | 'small' | 'medium' | 'large' | 'full'
    button_style: 'solid' | 'outline' | 'ghost'
    shadow_intensity: 'none' | 'small' | 'medium' | 'large'
    border_radius_sm?: number
    border_radius_md?: number
    border_radius_lg?: number
    border_radius_xl?: number
  
    // Contact
    contact_email?: string
    contact_phone?: string
    contact_address_line_1?: string
    contact_address_line_2?: string
    contact_city?: string
    contact_postcode?: string
    office_hours?: Record<string, string>
  
    // Social Media
    facebook_url?: string | null
    twitter_url?: string | null
    instagram_url?: string | null
    linkedin_url?: string | null
    youtube_url?: string | null
    tiktok_url?: string | null
    facebook_handle?: string
    twitter_handle?: string
    instagram_handle?: string
  
    // SEO
    meta_description?: string
    meta_keywords?: string[]
    og_image_url?: string | null
    og_title?: string
    og_description?: string
  
    // Custom
    custom_css?: string
    custom_fonts?: any
  
    // Features
    show_testimonials: boolean
    show_team_section: boolean
    show_contact_form: boolean
    show_live_chat?: boolean
    show_property_search: boolean
  
    // Metadata
    is_default?: boolean
  }
  
  export interface BrandResponse {
    success: boolean
    data: BrandSettings
  }
  
  export interface BrandError {
    error: true
    message: string
    code: string
    details?: string
  }