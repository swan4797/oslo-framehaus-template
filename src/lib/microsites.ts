// ========================================
// BRANCH MICROSITE FETCHING UTILITIES
// For Astro client site - fetches branch microsite content from Stratos CRM
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

export interface PropertiesFilter {
  listing_type?: 'sale' | 'rent' | 'both'
  min_price?: number
  max_price?: number
  property_types?: string[]
  bedrooms_min?: number
  bedrooms_max?: number
  include_sold?: boolean
  include_let?: boolean
  sort_by?: 'price_asc' | 'price_desc' | 'date_asc' | 'date_desc'
  limit?: number
}

export interface TeamMember {
  team_member_id: string
  first_name: string
  last_name: string
  job_title: string | null
  profile_image_url: string | null
  email: string | null
  phone: string | null
}

export interface BranchContact {
  email: string | null
  phone: string | null
  address: string | null
}

/**
 * Complete branch microsite content structure
 */
export interface BranchMicrosite {
  branch_id: string
  branch_name: string
  page_slug: string
  display_name: string | null
  description: string | null
  hero_image_url: string | null
  content_blocks: ContentBlock[]
  properties_filter: PropertiesFilter
  contact: BranchContact
  team_members: TeamMember[]
  last_updated: string
}

interface MicrositeResponse {
  success: boolean
  data: BranchMicrosite
  error?: boolean
  message?: string
}

interface AllMicrositesResponse {
  success: boolean
  data: BranchMicrosite[]
  count: number
}

// ========================================
// CACHE
// ========================================

const micrositeCache = new SimpleCache<BranchMicrosite>(DEFAULT_CACHE_TTL, 'Microsites')

// ========================================
// FETCH BRANCH MICROSITE
// ========================================

/**
 * Fetch content for a specific branch microsite
 * @param slug - The branch page slug (e.g., 'london-central')
 * @returns The microsite content object or null if not found
 */
export async function getBranchMicrosite(
  slug: string
): Promise<BranchMicrosite | null> {
  const cacheKey = `microsite:${slug}`
  const cached = micrositeCache.get(cacheKey)

  // Return cached data if still valid
  if (cached) {
    console.log(`[Microsites] Using cached data for: ${slug}`)
    return cached
  }

  try {
    const apiUrl = apiConfig.baseUrl
    const apiKey = apiConfig.apiKey

    console.log(`[Microsites] Fetching microsite for: ${slug}`)

    if (!apiUrl || !apiKey) {
      console.error('[Microsites] Missing API configuration')
      return null
    }

    const url = `${apiUrl}${apiConfig.functionsPath}/get-branch-microsite?slug=${slug}`
    console.log(`[Microsites] Full URL: ${url}`)

    const response = await fetch(url, {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    })

    console.log(`[Microsites] Response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Microsites] Failed to fetch microsite: ${response.status}`, errorText)
      return null
    }

    const result: MicrositeResponse = await response.json()
    console.log(`[Microsites] Response success: ${result.success}`)

    if (!result.success || result.error) {
      console.warn(`[Microsites] Microsite not found: ${slug}`, result)
      return null
    }

    console.log(`[Microsites] Got microsite with ${result.data?.content_blocks?.length || 0} sections`)

    // Cache the result
    micrositeCache.set(cacheKey, result.data)

    return result.data
  } catch (error) {
    console.error('[Microsites] Error fetching microsite:', error)
    return null
  }
}

/**
 * Fetch all published branch microsites
 * Useful for generating static routes
 */
export async function getAllBranchMicrosites(): Promise<BranchMicrosite[]> {
  try {
    const apiUrl = apiConfig.baseUrl
    const apiKey = apiConfig.apiKey

    if (!apiUrl || !apiKey) {
      console.error('[Microsites] Missing API configuration')
      return []
    }

    const response = await fetch(
      `${apiUrl}${apiConfig.functionsPath}/get-branch-microsites`,
      {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error(`[Microsites] Failed to fetch all microsites: ${response.status}`)
      return []
    }

    const result: AllMicrositesResponse = await response.json()

    if (!result.success) {
      return []
    }

    // Cache each microsite
    for (const microsite of result.data) {
      micrositeCache.set(`microsite:${microsite.page_slug}`, microsite)
    }

    return result.data
  } catch (error) {
    console.error('[Microsites] Error fetching all microsites:', error)
    return []
  }
}

// ========================================
// SECTION ACCESSORS
// Using shared content-utils with type-specific wrappers
// ========================================

/**
 * Get a section (content block) by its key
 */
export function getSection(
  microsite: BranchMicrosite | null,
  blockKey: string
): ContentBlock | null {
  return _getSection(microsite, blockKey)
}

/**
 * Get section title
 */
export function getSectionTitle(
  microsite: BranchMicrosite | null,
  blockKey: string,
  fallback = ''
): string {
  return _getSectionTitle(microsite, blockKey, fallback)
}

/**
 * Get section content (rich text HTML)
 */
export function getSectionContent(
  microsite: BranchMicrosite | null,
  blockKey: string,
  fallback = ''
): string {
  return _getSectionContent(microsite, blockKey, fallback)
}

/**
 * Get section image
 */
export function getSectionImage(
  microsite: BranchMicrosite | null,
  blockKey: string
): ImageContent | null {
  return _getSectionImage(microsite, blockKey)
}

/**
 * Get all sections sorted by order
 */
export function getAllSections(microsite: BranchMicrosite | null): ContentBlock[] {
  return _getAllSections(microsite)
}

/**
 * Check if a section key exists
 */
export function hasSection(microsite: BranchMicrosite | null, blockKey: string): boolean {
  return _hasSection(microsite, blockKey)
}

// ========================================
// CONTENT CHECKS
// ========================================

/**
 * Check if microsite has any content sections
 */
export function hasContent(microsite: BranchMicrosite | null): boolean {
  return _hasContent(microsite)
}

/**
 * Check if microsite has hero image
 */
export function hasHeroImage(microsite: BranchMicrosite | null): boolean {
  return !!microsite?.hero_image_url
}

/**
 * Get hero image
 */
export function getHeroImage(microsite: BranchMicrosite | null): ImageContent | null {
  if (!microsite?.hero_image_url) return null
  return {
    url: microsite.hero_image_url,
    alt: microsite.display_name || microsite.branch_name || '',
  }
}

/**
 * Check if microsite has team members
 */
export function hasTeamMembers(microsite: BranchMicrosite | null): boolean {
  return (microsite?.team_members?.length || 0) > 0
}

/**
 * Get team members
 */
export function getTeamMembers(microsite: BranchMicrosite | null): TeamMember[] {
  return microsite?.team_members || []
}

/**
 * Get branch contact info
 */
export function getBranchContact(microsite: BranchMicrosite | null): BranchContact {
  return microsite?.contact || { email: null, phone: null, address: null }
}

/**
 * Get properties filter
 */
export function getPropertiesFilter(microsite: BranchMicrosite | null): PropertiesFilter {
  return microsite?.properties_filter || {}
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Clear the microsite cache
 */
export function clearMicrositeCache(): void {
  micrositeCache.clear()
}

/**
 * Get cache status for debugging
 */
export function getMicrositeCacheStatus(): { size: number; keys: string[] } {
  return micrositeCache.getStatus()
}

/**
 * Format team member name
 */
export function formatTeamMemberName(member: TeamMember): string {
  return `${member.first_name} ${member.last_name}`
}
