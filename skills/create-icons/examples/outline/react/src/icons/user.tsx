import { createIcon } from "../create-icon"

/** Account */
export const UserIcon = createIcon("UserIcon", () => (
  <>
    <circle cx="12" cy="8" r="4" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ic-line, currentColor)", strokeOpacity: "var(--ic-line-opacity, 1)" }} />
    <path d="M4.5 20.5c.8-3.6 3.9-6 7.5-6s6.7 2.4 7.5 6" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ic-line, currentColor)", strokeOpacity: "var(--ic-line-opacity, 1)" }} />
  </>
))

export default UserIcon
