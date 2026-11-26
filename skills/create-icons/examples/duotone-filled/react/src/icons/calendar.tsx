import { createIcon } from "../create-icon"

/** Calendar */
export const CalendarIcon = createIcon("CalendarIcon", () => (
  <>
    <rect x="2.5" y="4" width="19" height="18" rx="3.5" stroke="none" style={{ fill: "var(--ic-body, currentColor)", fillOpacity: "var(--ic-body-opacity, 0.4)" }} />
    <path d="M6 4h12a3.5 3.5 0 0 1 3.5 3.5V9.5h-19V7.5A3.5 3.5 0 0 1 6 4z" stroke="none" style={{ fill: "var(--ic-detail, currentColor)", fillOpacity: "var(--ic-detail-opacity, 1)" }} />
    <rect x="6.6" y="2" width="2.2" height="4.5" rx="1.1" stroke="none" style={{ fill: "var(--ic-detail, currentColor)", fillOpacity: "var(--ic-detail-opacity, 1)" }} />
    <rect x="15.2" y="2" width="2.2" height="4.5" rx="1.1" stroke="none" style={{ fill: "var(--ic-detail, currentColor)", fillOpacity: "var(--ic-detail-opacity, 1)" }} />
    <rect x="6.5" y="13" width="3" height="3" rx="0.9" stroke="none" style={{ fill: "var(--ic-detail, currentColor)", fillOpacity: "var(--ic-detail-opacity, 1)" }} />
    <rect x="10.5" y="13" width="3" height="3" rx="0.9" stroke="none" style={{ fill: "var(--ic-detail, currentColor)", fillOpacity: "var(--ic-detail-opacity, 1)" }} />
    <rect x="14.5" y="17" width="3" height="3" rx="0.9" stroke="none" style={{ fill: "var(--ic-detail, currentColor)", fillOpacity: "var(--ic-detail-opacity, 1)" }} />
  </>
))

export default CalendarIcon
