// ========================================
// SCROLL ANIMATIONS
// Intersection Observer for reveal animations
// ========================================

interface ScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

const defaultOptions: ScrollAnimationOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
  once: true,
}

/**
 * Initialize scroll-triggered reveal animations
 * Elements with [data-reveal] or [data-reveal-stagger] will animate when scrolled into view
 */
export function initScrollAnimations(options: ScrollAnimationOptions = {}): void {
  const config = { ...defaultOptions, ...options }

  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Show all elements immediately without animation
    document.querySelectorAll('[data-reveal], [data-reveal-stagger]').forEach((el) => {
      el.classList.add('is-revealed')
    })
    return
  }

  // Create the Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement

          // Add revealed class to trigger animation
          element.classList.add('is-revealed')

          // Unobserve if animation should only happen once
          if (config.once) {
            observer.unobserve(element)
          }
        } else if (!config.once) {
          // Remove class if animation should repeat
          entry.target.classList.remove('is-revealed')
        }
      })
    },
    {
      threshold: config.threshold,
      rootMargin: config.rootMargin,
    }
  )

  // Observe all reveal elements (data attributes)
  const dataRevealElements = document.querySelectorAll('[data-reveal], [data-reveal-stagger]')
  dataRevealElements.forEach((el) => observer.observe(el))

  // Observe component classes that have auto-animations
  const componentSelectors = [
    // Sections
    '.intro-section:not(.no-animate):not(.is-revealed)',
    '.content-block:not(.no-animate):not(.is-revealed)',
    '.static-full-content:not(.no-animate):not(.is-revealed)',
    '.cta-banner:not(.no-animate):not(.is-revealed)',
    '.branch-contact:not(.no-animate):not(.is-revealed)',
    '.branch-team:not(.no-animate):not(.is-revealed)',
    '.team-section:not(.no-animate):not(.is-revealed)',
    '.service-section:not(.no-animate):not(.is-revealed)',
    '.faq-section:not(.no-animate):not(.is-revealed)',
    '.form-page-layout:not(.no-animate):not(.is-revealed)',
    // Heroes
    '.hero:not(.no-animate):not(.is-revealed)',
    '.static-hero:not(.no-animate):not(.is-revealed)',
    '.hero-split:not(.no-animate):not(.is-revealed)',
    '.detail-hero:not(.no-animate):not(.is-revealed)',
    '.search-hero:not(.no-animate):not(.is-revealed)',
    '.form-hero:not(.no-animate):not(.is-revealed)',
    '.favourites-hero:not(.no-animate):not(.is-revealed)',
    // Grids
    '.property-grid:not(.no-animate):not(.is-revealed)',
    '.team-grid:not(.no-animate):not(.is-revealed)',
    '.branches-grid:not(.no-animate):not(.is-revealed)',
    '.areas-grid:not(.no-animate):not(.is-revealed)',
    '.article-grid:not(.no-animate):not(.is-revealed)',
    '.service-grid__items:not(.no-animate):not(.is-revealed)',
    '.favourites-grid:not(.no-animate):not(.is-revealed)',
    '.area-sections-grid:not(.no-animate):not(.is-revealed)',
    '.contact-info-grid:not(.no-animate):not(.is-revealed)',
    '.search-results-grid:not(.no-animate):not(.is-revealed)',
    '.search-results-list:not(.no-animate):not(.is-revealed)',
    // Cards (when standalone)
    '.property-card:not(.no-animate):not(.is-revealed)',
    '.branch-card:not(.no-animate):not(.is-revealed)',
    '.team-card:not(.no-animate):not(.is-revealed)',
    '.team-member-card:not(.no-animate):not(.is-revealed)',
    '.area-card:not(.no-animate):not(.is-revealed)',
    '.area-section-card:not(.no-animate):not(.is-revealed)',
    '.blog-article-card:not(.no-animate):not(.is-revealed)',
    '.featured-blog-card:not(.no-animate):not(.is-revealed)',
    '.form-card:not(.no-animate):not(.is-revealed)',
    '.contact-card:not(.no-animate):not(.is-revealed)',
    '.share-card:not(.no-animate):not(.is-revealed)',
    // Stats
    '.intro-section__stats:not(.no-animate):not(.is-revealed)',
    '.property-specs:not(.no-animate):not(.is-revealed)',
    '.detail-stats:not(.no-animate):not(.is-revealed)',
    '.area-info-bar:not(.no-animate):not(.is-revealed)',
    // Forms
    '.form-section:not(.no-animate):not(.is-revealed)',
    '.enquiry-form:not(.no-animate):not(.is-revealed)',
    '.contact-form:not(.no-animate):not(.is-revealed)',
    '.viewing-form:not(.no-animate):not(.is-revealed)',
    '.valuation-form:not(.no-animate):not(.is-revealed)',
    '.newsletter-form:not(.no-animate):not(.is-revealed)',
    // Property details sections
    '.description-section:not(.no-animate):not(.is-revealed)',
    '.key-features-section:not(.no-animate):not(.is-revealed)',
    '.viewing-section:not(.no-animate):not(.is-revealed)',
    '.energy-performance-section:not(.no-animate):not(.is-revealed)',
    '.floorplan-section:not(.no-animate):not(.is-revealed)',
    '.virtual-tour-section:not(.no-animate):not(.is-revealed)',
    '.property-map-section:not(.no-animate):not(.is-revealed)',
    '.similar-properties:not(.no-animate):not(.is-revealed)',
    // Images
    '.image-gallery:not(.no-animate):not(.is-revealed)',
    '.gallery-grid:not(.no-animate):not(.is-revealed)',
    '.image-reveal:not(.is-revealed)',
    '.image-container-reveal:not(.is-revealed)',
    // Search components
    '.search-controls:not(.no-animate):not(.is-revealed)',
    '.search-sidebar:not(.no-animate):not(.is-revealed)',
    '.pagination:not(.no-animate):not(.is-revealed)',
    // Navigation
    '.breadcrumbs:not(.no-animate):not(.is-revealed)',
    // Related sections
    '.related-articles:not(.no-animate):not(.is-revealed)',
    // Footer
    '.site-footer:not(.no-animate):not(.is-revealed)',
    // Headings
    '.heading-reveal:not(.is-revealed)',
    '.heading-reveal-subtle:not(.is-revealed)',
    '.heading-reveal-fade:not(.is-revealed)',
    '.section-header:not(.no-animate):not(.is-revealed)',
    // Buttons
    '.btn-reveal:not(.is-revealed)',
    '.button-reveal:not(.is-revealed)',
    '.btn-group-stagger:not(.is-revealed)',
  ]

  const componentElements = document.querySelectorAll(componentSelectors.join(', '))
  componentElements.forEach((el) => observer.observe(el))
}

/**
 * Initialize on-load animations for hero sections
 * Elements with [data-load] animate immediately when page loads
 */
export function initLoadAnimations(): void {
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  // Elements with data-load are handled by CSS automatically
  // This function can be used for additional JS-based load animations
}

/**
 * Main initialization function
 * Call this on page load and after Astro page transitions
 */
export function initAnimations(): void {
  initScrollAnimations()
  initLoadAnimations()
}

// Auto-initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations)
  } else {
    initAnimations()
  }

  // Re-initialize on Astro page transitions
  document.addEventListener('astro:page-load', initAnimations)
}
