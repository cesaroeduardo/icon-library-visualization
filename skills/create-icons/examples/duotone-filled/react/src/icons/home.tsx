import { createIcon } from "../create-icon"

/** Home */
export const HomeIcon = createIcon("HomeIcon", () => (
  <>
    <path d="M4 10h16v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" stroke="none" style={{ fill: "var(--ic-body, currentColor)", fillOpacity: "var(--ic-body-opacity, 0.4)" }} />
    <path d="M10.7 2.5a2 2 0 0 1 2.6 0l8 6.6c.7.6.3 1.9-.65 1.9H3.35c-.95 0-1.35-1.3-.65-1.9z" stroke="none" style={{ fill: "var(--ic-detail, currentColor)", fillOpacity: "var(--ic-detail-opacity, 1)" }} />
    <path d="M10 22v-4a2 2 0 0 1 4 0v4z" stroke="none" style={{ fill: "var(--ic-detail, currentColor)", fillOpacity: "var(--ic-detail-opacity, 1)" }} />
  </>
))

export default HomeIcon
