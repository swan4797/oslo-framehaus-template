// ========================================
// SHARED CONTENT TYPES
// Common type definitions used across pages, microsites, and area-guides
// ========================================

/**
 * Image content structure used in content blocks
 */
export interface ImageContent {
  url: string
  alt: string
}

/**
 * Section content structure for content blocks
 * Contains title, rich text HTML content, and optional image
 */
export interface SectionContent {
  title: string
  content: string // Rich text HTML
  image: ImageContent | null
}

/**
 * Content block structure used across pages, microsites, and area guides
 */
export interface ContentBlock {
  block_key: string
  order: number
  section: SectionContent
}

/**
 * Generic content container with content blocks
 * Used as a type constraint for content accessor utilities
 */
export interface ContentContainer {
  content_blocks?: ContentBlock[] | null
}
