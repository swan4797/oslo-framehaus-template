// ========================================
// PAGE CONTENT FETCHING UTILITIES
// For Astro client site - fetches dynamic content from Stratos CRM
// Section-based content model
// ========================================

import { config } from './config'
import { SimpleCache, DEFAULT_CACHE_TTL } from './cache'
import type { ImageContent, SectionContent, ContentBlock } from './types/content'

// Re-export shared types for backward compatibility
export type { ImageContent, SectionContent, ContentBlock }

// Re-export content utilities for backward compatibility
export {
  getSection,
  getSectionTitle,
  getSectionContent,
  getSectionImage,
  getAllSections,
  hasSection,
  hasSectionContent,
  hasSectionImage,
  getSectionCount,
  // Legacy aliases
  getBlock,
  getAllBlocks,
  hasBlock,
  getBlockCount,
} from './content-utils'

// Import for internal use
import {
  getSection as _getSection,
  getSectionTitle as _getSectionTitle,
  getSectionContent as _getSectionContent,
  getSectionImage as _getSectionImage,
  getAllSections as _getAllSections,
  hasSection as _hasSection,
  hasSectionContent as _hasSectionContent,
  hasSectionImage as _hasSectionImage,
  hasContent as _hasContent,
  getSectionCount as _getSectionCount,
} from './content-utils'

// ========================================
// TYPES
// ========================================

/**
 * Complete page content structure
 */
export interface PageContent {
  page_key: string
  page_title: string
  content?: string // Main rich text content (like Blog)
  content_blocks: ContentBlock[]
  hero_image_url?: string | null
  hero_image_alt?: string | null
  last_updated: string
}

interface PageContentResponse {
  success: boolean
  data: PageContent
  error?: boolean
  message?: string
}

interface AllPagesResponse {
  success: boolean
  data: Record<
    string,
    {
      page_title: string
      content?: string
      content_blocks: ContentBlock[]
      hero_image_url?: string | null
      hero_image_alt?: string | null
      last_updated: string
    }
  >
}

// ========================================
// CACHE
// ========================================

const contentCache = new SimpleCache<PageContent>(DEFAULT_CACHE_TTL, 'Pages')

// ========================================
// FETCH PAGE CONTENT
// ========================================

/**
 * Fetch content for a specific page from Stratos CRM
 * @param pageKey - The page identifier (e.g., 'homepage', 'about', 'contact')
 * @returns The page content object or null if not found
 */
export async function getPageContent(
  pageKey: string
): Promise<PageContent | null> {
  const cacheKey = `page:${pageKey}`
  const cached = contentCache.get(cacheKey)

  // Return cached data if still valid
  if (cached) {
    console.log(`[Pages] Using cached data for: ${pageKey}`)
    return cached
  }

  try {
    const apiUrl = config.api.baseUrl
    const apiKey = config.api.apiKey

    console.log(`[Pages] Fetching page content for: ${pageKey}`)
    console.log(`[Pages] API URL: ${apiUrl}`)
    console.log(`[Pages] API Key: ${apiKey ? '***' + apiKey.slice(-4) : 'NOT SET'}`)

    if (!apiUrl || !apiKey) {
      console.error('[Pages] Missing API configuration for page content')
      return null
    }

    const url = `${apiUrl}${config.api.functionsPath}/get-page-content?page=${pageKey}`
    console.log(`[Pages] Full URL: ${url}`)

    const response = await fetch(url, {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    })

    console.log(`[Pages] Response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Pages] Failed to fetch page content: ${response.status}`, errorText)
      return null
    }

    const result: PageContentResponse = await response.json()
    console.log(`[Pages] Response success: ${result.success}`)

    if (!result.success || result.error) {
      console.warn(`[Pages] Page content not found: ${pageKey}`, result)
      return null
    }

    console.log(`[Pages] Got page content with ${result.data?.content_blocks?.length || 0} sections`)

    // Cache the result
    contentCache.set(cacheKey, result.data)

    return result.data
  } catch (error) {
    console.error('[Pages] Error fetching page content:', error)
    return null
  }
}

/**
 * Fetch content for all published pages
 * Useful for build-time static generation or preloading
 */
export async function getAllPageContent(): Promise<Record<string, PageContent>> {
  try {
    const apiUrl = config.api.baseUrl
    const apiKey = config.api.apiKey

    if (!apiUrl || !apiKey) {
      console.error('Missing API configuration for page content')
      return {}
    }

    const response = await fetch(
      `${apiUrl}${config.api.functionsPath}/get-page-content`,
      {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error(`Failed to fetch all page content: ${response.status}`)
      return {}
    }

    const result: AllPagesResponse = await response.json()

    if (!result.success) {
      return {}
    }

    // Transform and cache each page
    const pages: Record<string, PageContent> = {}
    for (const [key, data] of Object.entries(result.data)) {
      const pageContent: PageContent = {
        page_key: key,
        page_title: data.page_title,
        content: data.content,
        content_blocks: data.content_blocks,
        hero_image_url: data.hero_image_url,
        hero_image_alt: data.hero_image_alt,
        last_updated: data.last_updated,
      }
      pages[key] = pageContent
      contentCache.set(`page:${key}`, pageContent)
    }

    return pages
  } catch (error) {
    console.error('Error fetching all page content:', error)
    return {}
  }
}

// ========================================
// PAGE-LEVEL ACCESSORS
// ========================================

/**
 * Get the main page content (rich text HTML)
 */
export function getMainContent(page: PageContent | null, fallback = ''): string {
  return page?.content || fallback
}

/**
 * Get the hero image
 */
export function getHeroImage(page: PageContent | null): ImageContent | null {
  if (!page?.hero_image_url) return null
  return {
    url: page.hero_image_url,
    alt: page.hero_image_alt || '',
  }
}

/**
 * Check if page has main content
 */
export function hasMainContent(page: PageContent | null): boolean {
  return !!(page?.content && page.content.trim().length > 0)
}

/**
 * Check if page has hero image
 */
export function hasHeroImage(page: PageContent | null): boolean {
  return !!(page?.hero_image_url)
}

/**
 * Check if page has any content sections
 */
export function hasContent(page: PageContent | null): boolean {
  return _hasContent(page)
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Clear the content cache (useful for forcing fresh data)
 */
export function clearContentCache(): void {
  contentCache.clear()
}

/**
 * Get cache status for debugging
 */
export function getCacheStatus(): { size: number; keys: string[] } {
  return contentCache.getStatus()
}

/**
 * Create empty page content (useful for fallbacks)
 */
export function createEmptyPageContent(pageKey: string): PageContent {
  return {
    page_key: pageKey,
    page_title: pageKey.charAt(0).toUpperCase() + pageKey.slice(1),
    content_blocks: [],
    last_updated: new Date().toISOString(),
  }
}

// ========================================
// LEGACY COMPATIBILITY
// Additional aliases for old function names
// ========================================

/**
 * @deprecated Use getSectionContent instead - returns first non-empty of title or content
 */
export function getBlockText(
  page: PageContent | null,
  blockKey: string,
  fallback = ''
): string {
  // First try title, then content
  const title = _getSectionTitle(page, blockKey)
  if (title) return title
  return _getSectionContent(page, blockKey, fallback)
}

/**
 * @deprecated Use getSectionImage instead
 */
export function getBlockImage(
  page: PageContent | null,
  blockKey: string
): ImageContent | null {
  return _getSectionImage(page, blockKey)
}

/**
 * @deprecated CTA is no longer a separate type
 */
export function getBlockCTA(
  page: PageContent | null,
  blockKey: string
): { label: string; url: string } | null {
  return null
}

/**
 * @deprecated All blocks are sections now
 */
export function getBlocksByType(
  page: PageContent | null,
  type: string
): ContentBlock[] {
  return _getAllSections(page)
}
