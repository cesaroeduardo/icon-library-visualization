import { createIcon } from "../create-icon"

/** Mail */
export const MailIcon = createIcon("MailIcon", () => (
  <>
    <rect x="2" y="4.5" width="20" height="15" rx="3.2" stroke="none" style={{ fill: "var(--ic-body, currentColor)", fillOpacity: "var(--ic-body-opacity, 0.4)" }} />
    <path d="M5.6 8.6l6.4 4.5 6.4-4.5" fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ic-detail, currentColor)", strokeOpacity: "var(--ic-detail-opacity, 1)" }} />
  </>
))

export default MailIcon
