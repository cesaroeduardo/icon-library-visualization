import { createIcon } from "../create-icon"

/** Done */
export const CheckCircleIcon = createIcon("CheckCircleIcon", () => (
  <>
    <circle cx="12" cy="12" r="9" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ic-line, currentColor)", strokeOpacity: "var(--ic-line-opacity, 1)" }} />
    <path d="M8.2 12.2l2.6 2.6 5-5" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ic-line, currentColor)", strokeOpacity: "var(--ic-line-opacity, 1)" }} />
  </>
))

export default CheckCircleIcon
