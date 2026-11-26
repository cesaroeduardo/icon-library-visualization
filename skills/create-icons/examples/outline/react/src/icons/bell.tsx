import { createIcon } from "../create-icon"

/** Notifications */
export const BellIcon = createIcon("BellIcon", () => (
  <>
    <path d="M6 16.5V10a6 6 0 0 1 12 0v6.5l1.5 2h-15z" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ic-line, currentColor)", strokeOpacity: "var(--ic-line-opacity, 1)" }} />
    <path d="M10 21.1h4" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ic-line, currentColor)", strokeOpacity: "var(--ic-line-opacity, 1)" }} />
  </>
))

export default BellIcon
