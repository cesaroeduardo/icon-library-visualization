import { createIcon } from "../create-icon"

/** Search */
export const SearchIcon = createIcon("SearchIcon", () => (
  <>
    <circle cx="10.5" cy="10.5" r="4.7" stroke="none" style={{ fill: "var(--ic-body, currentColor)", fillOpacity: "var(--ic-body-opacity, 0.4)" }} />
    <path d="M10.5 3a7.5 7.5 0 1 1 0 15a7.5 7.5 0 1 1 0-15zM10.5 5.8a4.7 4.7 0 1 0 0 9.4a4.7 4.7 0 1 0 0-9.4z" stroke="none" fillRule="evenodd" clipRule="evenodd" style={{ fill: "var(--ic-detail, currentColor)", fillOpacity: "var(--ic-detail-opacity, 1)" }} />
    <path d="M16.4 16.4l4 4" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ic-detail, currentColor)", strokeOpacity: "var(--ic-detail-opacity, 1)" }} />
  </>
))

export default SearchIcon
