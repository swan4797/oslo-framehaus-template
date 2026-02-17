// ========================================
// FORM PAGE COMPONENT TYPES
// ========================================

// Re-export page content types from lib
export type { PageContent, ContentBlock, SectionContent, ImageContent } from '../../lib/pages'

// ========================================
// HERO TYPES
// ========================================

export interface FormHeroProps {
  title: string
  subtitle?: string
  /** Optional block key for CMS content injection */
  blockKey?: string
  /** Page content for CMS lookup */
  pageContent?: import('../../lib/pages').PageContent | null
}

// ========================================
// FAQ TYPES
// ========================================

export interface FaqItem {
  question: string
  answer: string
}

export interface FaqSectionProps {
  title?: string
  subtitle?: string
  items: FaqItem[]
  class?: string
}

// ========================================
// CONTACT INFO TYPES
// ========================================

export interface ContactInfo {
  email?: string | null
  phone?: string | null
  address?: string | null
}

export interface SocialLinks {
  facebook?: string | null
  instagram?: string | null
  linkedin?: string | null
  twitter?: string | null
  youtube?: string | null
  tiktok?: string | null
}

export interface ContactInfoGridProps {
  contactInfo: ContactInfo
  socialLinks?: SocialLinks
  class?: string
}

// ========================================
// FORM CARD TYPES
// ========================================

export interface FormCardProps {
  /** Optional CSS class override */
  class?: string
  /** Max width of the card (default: 60rem) */
  maxWidth?: string
}

export interface FormCardHeaderProps {
  /** Card header title */
  title: string
  /** Optional subtitle text */
  subtitle?: string
  /** Optional CSS class override */
  class?: string
}

export interface ContactAlternativeProps {
  /** Contact information with phone and/or email */
  contactInfo: ContactInfo
  /** Optional custom lead text (default: "Prefer to speak directly?") */
  leadText?: string
  /** Optional CSS class override */
  class?: string
}

// ========================================
// FORM MESSAGE TYPES
// ========================================

export interface FormMessageProps {
  type: 'success' | 'error'
  title: string
  text: string
  id: string
  contactInfo?: ContactInfo
}

// ========================================
// FORM PAGE CONFIG
// ========================================

export interface FormPageConfig {
  hero: {
    title: string
    subtitle: string
    blockKey?: string
  }
  faq: {
    title: string
    subtitle: string
    items: FaqItem[]
  }
}
