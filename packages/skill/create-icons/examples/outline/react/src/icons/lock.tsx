import { createIcon } from "../create-icon"

/** Lock */
export const LockIcon = createIcon("LockIcon", () => (
  <>
    <rect x="4.5" y="10.5" width="15" height="10.5" rx="2.5" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ic-line, currentColor)", strokeOpacity: "var(--ic-line-opacity, 1)" }} />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ic-line, currentColor)", strokeOpacity: "var(--ic-line-opacity, 1)" }} />
    <path d="M12 14.5V17" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ic-line, currentColor)", strokeOpacity: "var(--ic-line-opacity, 1)" }} />
  </>
))

export default LockIcon
