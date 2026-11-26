import { createIcon } from "../create-icon"

/** Reports */
export const ChartIcon = createIcon("ChartIcon", () => (
  <>
    <rect x="2.5" y="2.5" width="19" height="19" rx="4" stroke="none" style={{ fill: "var(--ic-body, currentColor)", fillOpacity: "var(--ic-body-opacity, 0.4)" }} />
    <rect x="6.5" y="12" width="2.6" height="6" rx="1.3" stroke="none" style={{ fill: "var(--ic-detail, currentColor)", fillOpacity: "var(--ic-detail-opacity, 1)" }} />
    <rect x="10.7" y="8.5" width="2.6" height="9.5" rx="1.3" stroke="none" style={{ fill: "var(--ic-detail, currentColor)", fillOpacity: "var(--ic-detail-opacity, 1)" }} />
    <rect x="14.9" y="6" width="2.6" height="12" rx="1.3" stroke="none" style={{ fill: "var(--ic-detail, currentColor)", fillOpacity: "var(--ic-detail-opacity, 1)" }} />
  </>
))

export default ChartIcon
