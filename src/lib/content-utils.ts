// ========================================
// SHARED CONTENT ACCESSOR UTILITIES
// Generic functions for working with content blocks
// Used by pages.ts, microsites.ts, and area-guides.ts
// ========================================

import type { ContentBlock, ContentContainer, ImageContent } from './types/content'

// ========================================
// SECTION ACCESSORS
// ========================================

/**
 * Get a content block by its key from any content container
 */
export function getSection<T extends ContentContainer>(
  content: T | null | undefined,
  blockKey: string
): ContentBlock | null {
  if (!content?.content_blocks) return null
  return content.content_blocks.find((b) => b.block_key === blockKey) || null
}

/**
 * Get section title
 */
export function getSectionTitle<T extends ContentContainer>(
  content: T | null | undefined,
  blockKey: string,
  fallback = ''
): string {
  const block = getSection(content, blockKey)
  if (!block?.section) return fallback
  return block.section.title || fallback
}

/**
 * Get section content (rich text HTML)
 */
export function getSectionContent<T extends ContentContainer>(
  content: T | null | undefined,
  blockKey: string,
  fallback = ''
): string {
  const block = getSection(content, blockKey)
  if (!block?.section) return fallback
  return block.section.content || fallback
}

/**
 * Get section image
 */
export function getSectionImage<T extends ContentContainer>(
  content: T | null | undefined,
  blockKey: string
): ImageContent | null {
  const block = getSection(content, blockKey)
  if (!block?.section?.image) return null
  return block.section.image
}

/**
 * Get all sections sorted by order
 */
export function getAllSections<T extends ContentContainer>(
  content: T | null | undefined
): ContentBlock[] {
  if (!content?.content_blocks) return []
  return [...content.content_blocks].sort((a, b) => a.order - b.order)
}

// ========================================
// EXISTENCE CHECKS
// ========================================

/**
 * Check if a section key exists
 */
export function hasSection<T extends ContentContainer>(
  content: T | null | undefined,
  blockKey: string
): boolean {
  return !!getSection(content, blockKey)
}

/**
 * Check if a section has content (title or rich text)
 */
export function hasSectionContent<T extends ContentContainer>(
  content: T | null | undefined,
  blockKey: string
): boolean {
  const block = getSection(content, blockKey)
  if (!block?.section) return false
  return !!(block.section.title || block.section.content)
}

/**
 * Check if a section has an image
 */
export function hasSectionImage<T extends ContentContainer>(
  content: T | null | undefined,
  blockKey: string
): boolean {
  const block = getSection(content, blockKey)
  return !!(block?.section?.image?.url)
}

/**
 * Check if content has any sections
 */
export function hasContent<T extends ContentContainer>(
  content: T | null | undefined
): boolean {
  return (content?.content_blocks?.length || 0) > 0
}

/**
 * Get the section count
 */
export function getSectionCount<T extends ContentContainer>(
  content: T | null | undefined
): number {
  return content?.content_blocks?.length || 0
}

// ========================================
// LEGACY COMPATIBILITY ALIASES
// ========================================

/**
 * @deprecated Use getSection instead
 */
export const getBlock = getSection

/**
 * @deprecated Use getAllSections instead
 */
export const getAllBlocks = getAllSections

/**
 * @deprecated Use hasSection instead
 */
export const hasBlock = hasSection

/**
 * @deprecated Use getSectionCount instead
 */
export const getBlockCount = getSectionCount
