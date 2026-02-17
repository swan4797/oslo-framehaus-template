// ========================================
// SEARCH PAGE CLIENT INTERACTIONS
// Client-side functionality for search page
// ========================================

import {
  sendPendingSearchEvent,
  extractSearchParamsFromUrl,
  storeSearchForTracking,
} from '../../../lib/search-tracker'
import type { StratosTrackerInstance } from '../../../lib/tracking/types'

declare global {
  interface Window {
    StratosTracker?: StratosTrackerInstance
  }
}

// ----------------------------------------
// SEARCH TRACKING
// ----------------------------------------

async function initSearchTracking(): Promise<void> {
  // First, try to send any pending search event (from form submission)
  const sentPending = await sendPendingSearchEvent()

  // If no pending event, track direct URL access
  if (!sentPending && window.location.search) {
    const directSearchParams = extractSearchParamsFromUrl()
    if (directSearchParams && directSearchParams.filters_count && directSearchParams.filters_count > 0) {
      console.log('[SearchPage] Tracking direct URL search:', directSearchParams)

      // For direct URL access, we can track immediately since we're already on the page
      if (window.StratosTracker) {
        const resultsCount = document.querySelector('[data-results-count]')?.getAttribute('data-results-count') || '0'

        window.StratosTracker.trackEvent('search', {
          // Location data
          location: directSearchParams.location || '',
          postcode: directSearchParams.postcode || '',

          // Price data
          min_price: directSearchParams.min_price || null,
          max_price: directSearchParams.max_price || null,

          // Property criteria
          bedrooms: directSearchParams.bedrooms || null,
          bathrooms: directSearchParams.bathrooms || null,
          property_type: directSearchParams.property_type || null,
          listing_type: directSearchParams.listing_type || 'sale',

          // All filters
          filters: directSearchParams.filters,
          filters_count: directSearchParams.filters_count,

          // Results
          results_count: parseInt(resultsCount),

          // Source
          source_page: directSearchParams.source_page || 'direct',
          source_component: 'url_direct',
        })

        console.log('[SearchPage] Direct search event tracked')
      }
    }
  }
}

// ----------------------------------------
// SORT SELECT HANDLER
// ----------------------------------------

// Default values to exclude from URL
const SEARCH_DEFAULTS: Record<string, string> = {
  listing_type: 'sale',
  page: '1',
  limit: '20',
  sort_by: 'newest',
}

function cleanSearchParams(params: URLSearchParams): URLSearchParams {
  const cleaned = new URLSearchParams()

  params.forEach((value, key) => {
    // Skip empty values and false booleans
    if (!value || value === 'false') return

    // Skip default values
    if (key in SEARCH_DEFAULTS && SEARCH_DEFAULTS[key] === value) return

    cleaned.set(key, value)
  })

  return cleaned
}

function initSortHandler(): void {
  const sortSelect = document.getElementById('sort_select') as HTMLSelectElement | null

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const urlParams = new URLSearchParams(window.location.search)

      // Set the new sort value (or remove if default)
      if (sortSelect.value === 'newest') {
        urlParams.delete('sort_by')
      } else {
        urlParams.set('sort_by', sortSelect.value)
      }

      // Reset pagination
      urlParams.delete('page')

      // Clean the params to remove defaults
      const cleanedParams = cleanSearchParams(urlParams)

      // Track filter change
      if (window.StratosTracker) {
        window.StratosTracker.trackEvent('filter_change', {
          filter_name: 'sort_by',
          filter_value: sortSelect.value,
          component: 'search_page',
        })
      }

      // Store current search params for re-tracking after navigation
      const searchData = extractSearchParamsFromUrl()
      if (searchData) {
        storeSearchForTracking({
          ...searchData,
          source_component: 'sort_change',
        })
      }

      const queryString = cleanedParams.toString()
      window.location.href = queryString ? `/search?${queryString}` : '/search'
    })
  }
}

// ----------------------------------------
// PAGE VIEW TRACKING
// ----------------------------------------

function trackPageView(): void {
  if (window.StratosTracker) {
    const urlParams = new URLSearchParams(window.location.search)
    const resultsCount = document.querySelector('[data-results-count]')?.getAttribute('data-results-count') || '0'

    window.StratosTracker.trackEvent('page_view', {
      page_type: 'search_results',
      listing_type: urlParams.get('listing_type') || 'sale',
      location: urlParams.get('location') || '',
      results_count: parseInt(resultsCount),
      filters_count: Array.from(urlParams.keys()).length,
    })
  }
}

// ----------------------------------------
// VIEW TOGGLE HANDLER
// ----------------------------------------

const VIEW_STORAGE_KEY = 'search_view_preference'

function getStoredViewPreference(): 'grid' | 'list' {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(VIEW_STORAGE_KEY)
    if (stored === 'grid' || stored === 'list') {
      return stored
    }
  }
  return 'grid'
}

function setStoredViewPreference(view: 'grid' | 'list'): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(VIEW_STORAGE_KEY, view)
  }
}

function initViewToggle(): void {
  const viewToggle = document.querySelector('[data-view-toggle]')
  if (!viewToggle) return

  const gridContainer = document.querySelector('[data-view-container="grid"]')
  const listContainer = document.querySelector('[data-view-container="list"]')
  const gridBtn = viewToggle.querySelector('[data-view="grid"]') as HTMLButtonElement | null
  const listBtn = viewToggle.querySelector('[data-view="list"]') as HTMLButtonElement | null

  if (!gridContainer || !listContainer || !gridBtn || !listBtn) return

  // Restore saved preference
  const savedView = getStoredViewPreference()
  if (savedView !== 'grid') {
    switchView(savedView)
  }

  // Switch view function
  function switchView(view: 'grid' | 'list'): void {
    const isGrid = view === 'grid'

    // Update containers
    gridContainer!.classList.toggle('results-view--hidden', !isGrid)
    listContainer!.classList.toggle('results-view--hidden', isGrid)

    // Update buttons
    gridBtn!.classList.toggle('view-toggle__btn--active', isGrid)
    listBtn!.classList.toggle('view-toggle__btn--active', !isGrid)
    gridBtn!.setAttribute('aria-pressed', String(isGrid))
    listBtn!.setAttribute('aria-pressed', String(!isGrid))

    // Store preference
    setStoredViewPreference(view)

    // Track view change
    if (window.StratosTracker) {
      window.StratosTracker.trackEvent('view_change', {
        view_type: view,
        component: 'search_results',
      })
    }

    console.log(`[SearchPage] View switched to: ${view}`)
  }

  // Button click handlers
  gridBtn.addEventListener('click', () => switchView('grid'))
  listBtn.addEventListener('click', () => switchView('list'))

  console.log('[SearchPage] View toggle initialized')
}

// ----------------------------------------
// INITIALIZATION
// ----------------------------------------

export async function initSearchPage(): Promise<void> {
  await initSearchTracking()
  initSortHandler()
  initViewToggle()
  trackPageView()
  console.log('[SearchPage] Initialized with search tracking and view toggle')
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchPage)
  } else {
    initSearchPage()
  }
}
