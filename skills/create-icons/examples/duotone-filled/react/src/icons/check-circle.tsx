import { createIcon } from "../create-icon"

/** Done */
export const CheckCircleIcon = createIcon("CheckCircleIcon", () => (
  <>
    <circle cx="12" cy="12" r="10" stroke="none" style={{ fill: "var(--ic-body, currentColor)", fillOpacity: "var(--ic-body-opacity, 0.4)" }} />
    <path d="M7.8 12.3l2.8 2.8 5.6-5.6" fill="none" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ic-detail, currentColor)", strokeOpacity: "var(--ic-detail-opacity, 1)" }} />
  </>
))

export default CheckCircleIcon
