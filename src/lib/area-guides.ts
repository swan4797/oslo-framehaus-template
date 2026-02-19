// ========================================
// AREA GUIDES FETCHING UTILITIES
// For Astro client site - fetches area guide content from Stratos CRM
// ========================================

import { apiConfig } from './config'
import { SimpleCache, DEFAULT_CACHE_TTL } from './cache'
import type { ImageContent, SectionContent, ContentBlock } from './types/content'
import {
  getSection as _getSection,
  getSectionTitle as _getSectionTitle,
  getSectionContent as _getSectionContent,
  getSectionImage as _getSectionImage,
  getAllSections as _getAllSections,
  hasSection as _hasSection,
  hasContent as _hasContent,
} from './content-utils'

// Re-export shared types for backward compatibility
export type { ImageContent, SectionContent, ContentBlock }

// ========================================
// TYPES
// ========================================

export interface AreaSection {
  title: string
  content: string // Rich text HTML
  image: ImageContent | null
  items?: string[] // List items (amenities, schools, transport links)
}

/**
 * Complete area guide content structure
 */
export interface AreaGuide {
  area_guide_id: string
  area_name: string
  page_slug: string
  display_name: string | null
  description: string | null
  hero_image_url: string | null
  city: string | null
  county: string | null
  postcodes: string[]
  content_blocks: ContentBlock[]
  local_amenities: AreaSection
  schools: AreaSection
  transport: AreaSection
  demographics: AreaSection
  show_sales: boolean
  show_lettings: boolean
  properties_limit: number
  meta_title: string | null
  meta_description: string | null
  last_updated: string
}

interface AreaGuideResponse {
  success: boolean
  data: AreaGuide
  error?: boolean
  message?: string
}

interface AllAreaGuidesResponse {
  success: boolean
  data: AreaGuide[]
  count: number
}

// ========================================
// CACHE
// ========================================

const areaGuideCache = new SimpleCache<AreaGuide>(DEFAULT_CACHE_TTL, 'AreaGuides')

// ========================================
// FETCH AREA GUIDE
// ========================================

/**
 * Fetch content for a specific area guide
 * @param slug - The area guide page slug (e.g., 'caerleon')
 * @returns The area guide content object or null if not found
 */
export async function getAreaGuide(
  slug: string
): Promise<AreaGuide | null> {
  const cacheKey = `area-guide:${slug}`
  const cached = areaGuideCache.get(cacheKey)

  // Return cached data if still valid
  if (cached) {
    console.log(`[AreaGuides] Using cached data for: ${slug}`)
    return cached
  }

  try {
    const apiUrl = apiConfig.baseUrl
    const apiKey = apiConfig.apiKey

    console.log(`[AreaGuides] Fetching area guide for: ${slug}`)

    if (!apiUrl || !apiKey) {
      console.error('[AreaGuides] Missing API configuration')
      return null
    }

    const url = `${apiUrl}${apiConfig.functionsPath}/get-area-guide?slug=${slug}`
    console.log(`[AreaGuides] Full URL: ${url}`)

    const response = await fetch(url, {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    })

    console.log(`[AreaGuides] Response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[AreaGuides] Failed to fetch area guide: ${response.status}`, errorText)
      return null
    }

    const result: AreaGuideResponse = await response.json()
    console.log(`[AreaGuides] Response success: ${result.success}`)

    if (!result.success || result.error) {
      console.warn(`[AreaGuides] Area guide not found: ${slug}`, result)
      return null
    }

    console.log(`[AreaGuides] Got area guide with ${result.data?.content_blocks?.length || 0} sections`)

    // Cache the result
    areaGuideCache.set(cacheKey, result.data)

    return result.data
  } catch (error) {
    console.error('[AreaGuides] Error fetching area guide:', error)
    return null
  }
}

/**
 * Fetch all published area guides
 * Useful for generating static routes
 */
export async function getAllAreaGuides(): Promise<AreaGuide[]> {
  try {
    const apiUrl = apiConfig.baseUrl
    const apiKey = apiConfig.apiKey

    if (!apiUrl || !apiKey) {
      console.error('[AreaGuides] Missing API configuration')
      return []
    }

    const response = await fetch(
      `${apiUrl}${apiConfig.functionsPath}/get-area-guides`,
      {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error(`[AreaGuides] Failed to fetch all area guides: ${response.status}`)
      return []
    }

    const result: AllAreaGuidesResponse = await response.json()

    if (!result.success) {
      return []
    }

    // Cache each area guide
    for (const guide of result.data) {
      areaGuideCache.set(`area-guide:${guide.page_slug}`, guide)
    }

    return result.data
  } catch (error) {
    console.error('[AreaGuides] Error fetching all area guides:', error)
    return []
  }
}

// ========================================
// SECTION ACCESSORS
// Using shared content-utils with type-specific wrappers
// ========================================

/**
 * Get a content block by its key
 */
export function getSection(
  guide: AreaGuide | null,
  blockKey: string
): ContentBlock | null {
  return _getSection(guide, blockKey)
}

/**
 * Get section title
 */
export function getSectionTitle(
  guide: AreaGuide | null,
  blockKey: string,
  fallback = ''
): string {
  return _getSectionTitle(guide, blockKey, fallback)
}

/**
 * Get section content (rich text HTML)
 */
export function getSectionContent(
  guide: AreaGuide | null,
  blockKey: string,
  fallback = ''
): string {
  return _getSectionContent(guide, blockKey, fallback)
}

/**
 * Get section image
 */
export function getSectionImage(
  guide: AreaGuide | null,
  blockKey: string
): ImageContent | null {
  return _getSectionImage(guide, blockKey)
}

/**
 * Get all content blocks sorted by order
 */
export function getAllSections(guide: AreaGuide | null): ContentBlock[] {
  return _getAllSections(guide)
}

/**
 * Check if a section key exists
 */
export function hasSection(guide: AreaGuide | null, blockKey: string): boolean {
  return _hasSection(guide, blockKey)
}

// ========================================
// AREA SECTION ACCESSORS
// ========================================

/**
 * Check if an area section has content
 */
export function hasAreaSectionContent(section: AreaSection | null | undefined): boolean {
  return !!section?.content?.trim()
}

/**
 * Get local amenities section
 */
export function getLocalAmenities(guide: AreaGuide | null): AreaSection | null {
  return guide?.local_amenities || null
}

/**
 * Get schools section
 */
export function getSchools(guide: AreaGuide | null): AreaSection | null {
  return guide?.schools || null
}

/**
 * Get transport section
 */
export function getTransport(guide: AreaGuide | null): AreaSection | null {
  return guide?.transport || null
}

/**
 * Get demographics section
 */
export function getDemographics(guide: AreaGuide | null): AreaSection | null {
  return guide?.demographics || null
}

// ========================================
// CONTENT CHECKS
// ========================================

/**
 * Check if area guide has any content sections
 */
export function hasContent(guide: AreaGuide | null): boolean {
  return _hasContent(guide)
}

/**
 * Check if area guide has hero image
 */
export function hasHeroImage(guide: AreaGuide | null): boolean {
  return !!guide?.hero_image_url
}

/**
 * Get hero image
 */
export function getHeroImage(guide: AreaGuide | null): ImageContent | null {
  if (!guide?.hero_image_url) return null
  return {
    url: guide.hero_image_url,
    alt: guide.display_name || guide.area_name || '',
  }
}

/**
 * Get area guide title (display name or area name)
 */
export function getGuideTitle(guide: AreaGuide | null): string {
  return guide?.display_name || guide?.area_name || ''
}

/**
 * Get postcodes as formatted string
 */
export function getPostcodesString(guide: AreaGuide | null): string {
  return guide?.postcodes?.join(', ') || ''
}

/**
 * Get location string (city, county)
 */
export function getLocationString(guide: AreaGuide | null): string {
  const parts = [guide?.city, guide?.county].filter(Boolean)
  return parts.join(', ')
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Clear the area guide cache
 */
export function clearAreaGuideCache(): void {
  areaGuideCache.clear()
}

/**
 * Get cache status for debugging
 */
export function getAreaGuideCacheStatus(): { size: number; keys: string[] } {
  return areaGuideCache.getStatus()
}
