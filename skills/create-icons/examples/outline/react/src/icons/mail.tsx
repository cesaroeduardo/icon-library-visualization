import { createIcon } from "../create-icon"

/** Mail */
export const MailIcon = createIcon("MailIcon", () => (
  <>
    <rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ic-line, currentColor)", strokeOpacity: "var(--ic-line-opacity, 1)" }} />
    <path d="M3.8 7.2l8.2 6 8.2-6" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ic-line, currentColor)", strokeOpacity: "var(--ic-line-opacity, 1)" }} />
  </>
))

export default MailIcon
