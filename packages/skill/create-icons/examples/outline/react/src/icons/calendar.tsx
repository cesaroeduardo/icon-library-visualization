import { createIcon } from "../create-icon"

/** Calendar */
export const CalendarIcon = createIcon("CalendarIcon", () => (
  <>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ic-line, currentColor)", strokeOpacity: "var(--ic-line-opacity, 1)" }} />
    <path d="M3.5 10h17" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ic-line, currentColor)", strokeOpacity: "var(--ic-line-opacity, 1)" }} />
    <path d="M8 3v4" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ic-line, currentColor)", strokeOpacity: "var(--ic-line-opacity, 1)" }} />
    <path d="M16 3v4" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ic-line, currentColor)", strokeOpacity: "var(--ic-line-opacity, 1)" }} />
    <circle cx="8.2" cy="14.5" r="1.1" stroke="none" style={{ fill: "var(--ic-line, currentColor)", fillOpacity: "var(--ic-line-opacity, 1)" }} />
    <circle cx="12" cy="14.5" r="1.1" stroke="none" style={{ fill: "var(--ic-line, currentColor)", fillOpacity: "var(--ic-line-opacity, 1)" }} />
  </>
))

export default CalendarIcon
