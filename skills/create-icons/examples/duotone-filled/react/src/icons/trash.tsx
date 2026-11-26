import { createIcon } from "../create-icon"

/** Delete */
export const TrashIcon = createIcon("TrashIcon", () => (
  <>
    <path d="M5.5 7.5h13l-.9 12a2.7 2.7 0 0 1-2.7 2.5H9.1a2.7 2.7 0 0 1-2.7-2.5z" stroke="none" style={{ fill: "var(--ic-body, currentColor)", fillOpacity: "var(--ic-body-opacity, 0.4)" }} />
    <rect x="9.5" y="2.2" width="5" height="3.2" rx="1.2" stroke="none" style={{ fill: "var(--ic-detail, currentColor)", fillOpacity: "var(--ic-detail-opacity, 1)" }} />
    <rect x="3.5" y="4.6" width="17" height="2.6" rx="1.3" stroke="none" style={{ fill: "var(--ic-detail, currentColor)", fillOpacity: "var(--ic-detail-opacity, 1)" }} />
    <rect x="9.4" y="10.5" width="1.8" height="7.5" rx="0.9" stroke="none" style={{ fill: "var(--ic-detail, currentColor)", fillOpacity: "var(--ic-detail-opacity, 1)" }} />
    <rect x="12.8" y="10.5" width="1.8" height="7.5" rx="0.9" stroke="none" style={{ fill: "var(--ic-detail, currentColor)", fillOpacity: "var(--ic-detail-opacity, 1)" }} />
  </>
))

export default TrashIcon
