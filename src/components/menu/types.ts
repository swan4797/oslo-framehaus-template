// ========================================
// HEADER TYPE DEFINITIONS
// ========================================

/** Available header visual variants */
export type HeaderVariant = 'transparent' | 'solid' | 'dark' | 'minimal'

/** Navigation dropdown item */
export interface NavDropdownItem {
  label: string
  href: string
  description?: string
  icon?: string
}

/** Navigation item (with optional dropdown) */
export interface NavItem {
  label: string
  href: string
  dropdown?: NavDropdownItem[]
  highlight?: boolean
}

/** Header visual configuration per variant */
export interface HeaderVariantConfig {
  /** Background color */
  background?: string
  /** Text color */
  textColor?: string
  /** Text hover color */
  textHover?: string
  /** Border color */
  borderColor?: string
  /** Use light logo (for dark backgrounds) */
  lightLogo?: boolean
  /** Background when scrolled */
  scrolledBackground?: string
  /** Add blur effect when scrolled */
  scrolledBlur?: boolean
}

/** Complete header configuration */
export interface HeaderConfig {
  /** Visual variant preset */
  variant?: HeaderVariant
  /** Custom variant overrides */
  variantConfig?: HeaderVariantConfig
  /** Show/hide the CTA button */
  showCta?: boolean
  /** CTA button text */
  ctaText?: string
  /** CTA button link */
  ctaHref?: string
  /** Show/hide the search button */
  showSearch?: boolean
  /** Custom navigation items (overrides defaults) */
  navItems?: NavItem[]
  /** Enable scroll hide/show behavior */
  enableScrollBehavior?: boolean
  /** Enable scroll appearance change */
  enableScrollAppearance?: boolean
  /** Sticky header */
  sticky?: boolean
}

/** Header component props - supports both simple and advanced usage */
export interface HeaderProps extends HeaderConfig {
  /** @deprecated Use config.variantConfig.background instead */
  backgroundColor?: string
  /** @deprecated Use config.variantConfig.lightLogo instead */
  forceLightLogo?: boolean
}

/** FullscreenMenu component props */
export interface FullscreenMenuProps {
  businessName: string
  logoUrl: string | undefined
  hasValidLogo: boolean
  navItems: NavItem[]
  navDescriptions: Record<string, string>
  defaultTagline: string
}
