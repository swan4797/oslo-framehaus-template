// ========================================
// SHARED CACHE UTILITY
// Generic caching utilities used across lib modules
// ========================================

/**
 * Cache entry with data and timestamp
 */
interface CacheEntry<T> {
  data: T
  timestamp: number
}

/**
 * Simple in-memory cache with TTL support
 * Used for caching API responses across pages, microsites, area-guides, etc.
 */
export class SimpleCache<T> {
  private cache: Map<string, CacheEntry<T>>
  private ttl: number
  private name: string

  /**
   * Create a new cache instance
   * @param ttl - Time to live in milliseconds (default: 60000 = 1 minute)
   * @param name - Optional name for logging
   */
  constructor(ttl: number = 60000, name: string = 'Cache') {
    this.cache = new Map()
    this.ttl = ttl
    this.name = name
  }

  /**
   * Get cached data if valid (not expired)
   */
  get(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() - entry.timestamp >= this.ttl) {
      // Entry expired
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  /**
   * Set cached data
   */
  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  /**
   * Check if cache has valid entry for key
   */
  has(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * Delete a specific cache entry
   */
  delete(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Clear all cached entries
   */
  clear(): void {
    this.cache.clear()
    console.log(`[${this.name}] Cache cleared`)
  }

  /**
   * Get cache status for debugging
   */
  getStatus(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }

  /**
   * Get the TTL value
   */
  getTTL(): number {
    return this.ttl
  }
}

/**
 * Single-value cache for simple caching scenarios
 * Used for caching a single item (like brand settings)
 */
export class SingleValueCache<T> {
  private value: T | null = null
  private timestamp: number = 0
  private ttl: number
  private name: string

  /**
   * Create a new single-value cache
   * @param ttl - Time to live in milliseconds
   * @param name - Optional name for logging
   */
  constructor(ttl: number = 60000, name: string = 'SingleCache') {
    this.ttl = ttl
    this.name = name
  }

  /**
   * Get cached value if valid
   */
  get(): T | null {
    if (!this.value) return null

    if (Date.now() - this.timestamp >= this.ttl) {
      // Entry expired
      this.clear()
      return null
    }

    return this.value
  }

  /**
   * Set cached value
   */
  set(data: T): void {
    this.value = data
    this.timestamp = Date.now()
  }

  /**
   * Check if cache has valid value
   */
  has(): boolean {
    return this.get() !== null
  }

  /**
   * Clear the cached value
   */
  clear(): void {
    this.value = null
    this.timestamp = 0
    console.log(`[${this.name}] Cache cleared`)
  }

  /**
   * Get the timestamp of the cached value
   */
  getTimestamp(): number {
    return this.timestamp
  }

  /**
   * Check if cache is expired (but may still have stale data)
   */
  isExpired(): boolean {
    if (!this.value) return true
    return Date.now() - this.timestamp >= this.ttl
  }
}

// ========================================
// DEFAULT CACHE INSTANCES
// ========================================

/** Default cache TTL: 1 minute */
export const DEFAULT_CACHE_TTL = 60000

/** Development cache TTL: 5 seconds */
export const DEV_CACHE_TTL = 5000
