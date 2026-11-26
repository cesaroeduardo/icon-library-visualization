import { createIcon } from "../create-icon"

/** Search */
export const SearchIcon = createIcon("SearchIcon", () => (
  <>
    <circle cx="10.5" cy="10.5" r="6.5" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ic-line, currentColor)", strokeOpacity: "var(--ic-line-opacity, 1)" }} />
    <path d="M15.4 15.4L20 20" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ic-line, currentColor)", strokeOpacity: "var(--ic-line-opacity, 1)" }} />
  </>
))

export default SearchIcon
