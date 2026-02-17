import type { StratosTrackerInstance } from '../lib/tracking/types'

declare global {
  interface Window {
    StratosTracker?: StratosTrackerInstance
  }
}

export {}
