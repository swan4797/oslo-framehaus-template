// ========================================
// HEADER CONTROLLER
// Handles mobile menu, dropdowns, and scroll behavior
// ========================================

export class HeaderController {
  private header: HTMLElement | null
  private mobileToggle: HTMLElement | null
  private mobileMenu: HTMLElement | null
  private lastScrollY: number = 0
  private ticking: boolean = false
  private scrollThreshold: number = 10
  private topThreshold: number = 100

  constructor() {
    this.header = document.getElementById('site-header')
    this.mobileToggle = document.getElementById('mobile-menu-toggle')
    this.mobileMenu = document.getElementById('mobile-menu')

    this.init()
  }

  private init(): void {
    this.setupMobileMenu()
    this.setupMobileDropdowns()
    this.setupDesktopDropdowns()
    this.setupKeyboardNavigation()
    this.setupNavHoverEffects()

    // Check if scroll behavior is enabled
    const enableScrollBehavior = this.header?.dataset.scrollBehavior === 'true'
    const enableScrollAppearance = this.header?.dataset.scrollAppearance === 'true'

    if (enableScrollBehavior || enableScrollAppearance) {
      this.setupScrollBehavior()
    }
  }

  // ========================================
  // MOBILE MENU
  // ========================================

  private setupMobileMenu(): void {
    this.mobileToggle?.addEventListener('click', () => this.toggleMobileMenu())

    // Close button in full-screen nav
    const navCloseBtn = document.getElementById('nav-close-btn')
    navCloseBtn?.addEventListener('click', () => this.closeMobileMenu())

    // Close on nav link click (for non-dropdown links)
    const navLinks = document.querySelectorAll('.header__nav-link:not(.header__nav-link--dropdown)')
    navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu())
    })

    // Close on dropdown link click
    const dropdownLinks = document.querySelectorAll('.header__dropdown-link')
    dropdownLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu())
    })

    // Close on link click (mobile menu - kept for backwards compatibility)
    this.mobileMenu?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu())
    })
  }

  private toggleMobileMenu(): void {
    const isOpen = this.header?.classList.contains('is-menu-open')

    if (isOpen) {
      this.closeMobileMenu()
    } else {
      this.openMobileMenu()
    }
  }

  private openMobileMenu(): void {
    this.header?.classList.add('is-menu-open')
    this.mobileToggle?.setAttribute('aria-expanded', 'true')
    this.mobileToggle?.setAttribute('aria-label', 'Close menu')
    this.mobileMenu?.setAttribute('aria-hidden', 'false')
    document.body.style.overflow = 'hidden'
  }

  private closeMobileMenu(): void {
    this.header?.classList.remove('is-menu-open')
    this.mobileToggle?.setAttribute('aria-expanded', 'false')
    this.mobileToggle?.setAttribute('aria-label', 'Open menu')
    this.mobileMenu?.setAttribute('aria-hidden', 'true')
    document.body.style.overflow = ''
  }

  // ========================================
  // DESKTOP DROPDOWNS
  // ========================================

  private setupDesktopDropdowns(): void {
    const dropdownItems = document.querySelectorAll('.header__nav-item--has-dropdown')

    dropdownItems.forEach(item => {
      const button = item.querySelector('.header__nav-link--dropdown')

      // Toggle on click for accessibility
      button?.addEventListener('click', (e) => {
        e.preventDefault()
        const isExpanded = button.getAttribute('aria-expanded') === 'true'

        // Close all other dropdowns
        dropdownItems.forEach(otherItem => {
          const otherButton = otherItem.querySelector('.header__nav-link--dropdown')
          otherButton?.setAttribute('aria-expanded', 'false')
        })

        // Toggle current
        button.setAttribute('aria-expanded', isExpanded ? 'false' : 'true')
      })
    })

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (!target.closest('.header__nav-item--has-dropdown')) {
        dropdownItems.forEach(item => {
          const button = item.querySelector('.header__nav-link--dropdown')
          button?.setAttribute('aria-expanded', 'false')
        })
      }
    })
  }

  // ========================================
  // MOBILE DROPDOWNS
  // ========================================

  private setupMobileDropdowns(): void {
    const dropdownToggles = this.mobileMenu?.querySelectorAll('.header__mobile-link--dropdown')

    dropdownToggles?.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const parent = toggle.closest('.header__mobile-item--has-dropdown')
        const isOpen = parent?.classList.contains('is-open')

        // Close all other dropdowns
        this.mobileMenu?.querySelectorAll('.header__mobile-item--has-dropdown').forEach(item => {
          item.classList.remove('is-open')
          item.querySelector('.header__mobile-link--dropdown')?.setAttribute('aria-expanded', 'false')
        })

        // Toggle current dropdown
        if (!isOpen) {
          parent?.classList.add('is-open')
          toggle.setAttribute('aria-expanded', 'true')
        }
      })
    })
  }

  // ========================================
  // KEYBOARD NAVIGATION
  // ========================================

  private setupKeyboardNavigation(): void {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close mobile menu
        if (this.header?.classList.contains('is-menu-open')) {
          this.closeMobileMenu()
        }

        // Close desktop dropdowns
        document.querySelectorAll('.header__nav-link--dropdown').forEach(button => {
          button.setAttribute('aria-expanded', 'false')
        })
      }
    })
  }

  // ========================================
  // NAV HOVER EFFECTS
  // Dynamic tagline change on nav item hover
  // ========================================

  private setupNavHoverEffects(): void {
    const taglineWrapper = document.getElementById('nav-tagline-wrapper')
    const defaultTagline = document.getElementById('nav-tagline-default')
    const hoverTagline = document.getElementById('nav-tagline-hover')
    const navItems = document.querySelectorAll('.header__nav-item')
    const dropdownLinks = document.querySelectorAll('.header__dropdown-link')

    if (!taglineWrapper || !defaultTagline || !hoverTagline) return

    // Handle nav item hover
    navItems.forEach(item => {
      const description = (item as HTMLElement).dataset.navDescription

      item.addEventListener('mouseenter', () => {
        if (description) {
          this.showHoverTagline(hoverTagline, defaultTagline, description)
        }
      })

      item.addEventListener('mouseleave', () => {
        this.hideHoverTagline(hoverTagline, defaultTagline)
      })
    })

    // Handle dropdown link hover (override parent description)
    dropdownLinks.forEach(link => {
      const description = (link as HTMLElement).dataset.navDescription

      link.addEventListener('mouseenter', (e) => {
        e.stopPropagation()
        if (description) {
          this.showHoverTagline(hoverTagline, defaultTagline, description)
        }
      })

      link.addEventListener('mouseleave', (e) => {
        e.stopPropagation()
        // Check if still within a nav item with description
        const parentItem = (e.target as HTMLElement).closest('.header__nav-item')
        const parentDescription = parentItem ? (parentItem as HTMLElement).dataset.navDescription : null

        if (parentDescription) {
          this.showHoverTagline(hoverTagline, defaultTagline, parentDescription)
        } else {
          this.hideHoverTagline(hoverTagline, defaultTagline)
        }
      })
    })

    // Reset when leaving the entire nav area
    const navColumn = document.querySelector('.header__nav-column--left')
    navColumn?.addEventListener('mouseleave', () => {
      this.hideHoverTagline(hoverTagline, defaultTagline)
    })
  }

  private showHoverTagline(hoverEl: HTMLElement, defaultEl: HTMLElement, text: string): void {
    hoverEl.textContent = text
    hoverEl.classList.add('is-visible')
    defaultEl.classList.remove('header__nav-tagline--active')
    defaultEl.classList.add('is-hidden')
  }

  private hideHoverTagline(hoverEl: HTMLElement, defaultEl: HTMLElement): void {
    hoverEl.classList.remove('is-visible')
    defaultEl.classList.remove('is-hidden')
    defaultEl.classList.add('header__nav-tagline--active')
  }

  // ========================================
  // SCROLL BEHAVIOR
  // ========================================

  private setupScrollBehavior(): void {
    window.addEventListener('scroll', () => this.onScroll(), { passive: true })
    this.updateHeaderOnScroll()
  }

  private onScroll(): void {
    if (!this.ticking) {
      requestAnimationFrame(() => this.updateHeaderOnScroll())
      this.ticking = true
    }
  }

  private updateHeaderOnScroll(): void {
    const currentScrollY = window.scrollY
    const scrollDelta = currentScrollY - this.lastScrollY
    const isMenuOpen = this.header?.classList.contains('is-menu-open')
    const enableScrollBehavior = this.header?.dataset.scrollBehavior === 'true'
    const enableScrollAppearance = this.header?.dataset.scrollAppearance === 'true'

    // Don't hide if mobile menu is open
    if (isMenuOpen) {
      this.ticking = false
      return
    }

    // Handle scroll appearance (background change)
    if (enableScrollAppearance) {
      if (currentScrollY > 10) {
        this.header?.classList.add('is-scrolled')
      } else {
        this.header?.classList.remove('is-scrolled')
      }
    }

    // Handle scroll behavior (hide/show)
    if (enableScrollBehavior) {
      // Always show header when near top
      if (currentScrollY < this.topThreshold) {
        this.header?.classList.remove('is-hidden')
        this.lastScrollY = currentScrollY
        this.ticking = false
        return
      }

      // Only trigger if scroll exceeds threshold
      if (Math.abs(scrollDelta) < this.scrollThreshold) {
        this.ticking = false
        return
      }

      // Hide on scroll down, show on scroll up
      if (scrollDelta > 0 && currentScrollY > this.topThreshold) {
        this.header?.classList.add('is-hidden')
      } else if (scrollDelta < 0) {
        this.header?.classList.remove('is-hidden')
      }
    }

    this.lastScrollY = currentScrollY
    this.ticking = false
  }
}

// ========================================
// INITIALIZATION FUNCTION
// ========================================

export function initHeaderController(): void {
  new HeaderController()
}
