import { createIcon } from "../create-icon"

/** Lock */
export const LockIcon = createIcon("LockIcon", () => (
  <>
    <rect x="4" y="10" width="16" height="12" rx="3.2" stroke="none" style={{ fill: "var(--ic-body, currentColor)", fillOpacity: "var(--ic-body-opacity, 0.4)" }} />
    <path d="M8 10V7.5a4 4 0 0 1 8 0V10" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ic-detail, currentColor)", strokeOpacity: "var(--ic-detail-opacity, 1)" }} />
    <circle cx="12" cy="15.2" r="1.7" stroke="none" style={{ fill: "var(--ic-detail, currentColor)", fillOpacity: "var(--ic-detail-opacity, 1)" }} />
    <rect x="11.1" y="15.5" width="1.8" height="3.5" rx="0.9" stroke="none" style={{ fill: "var(--ic-detail, currentColor)", fillOpacity: "var(--ic-detail-opacity, 1)" }} />
  </>
))

export default LockIcon
