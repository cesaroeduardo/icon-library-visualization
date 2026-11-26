import { createIcon } from "../create-icon"

/** Account */
export const UserIcon = createIcon("UserIcon", () => (
  <>
    <path d="M4 21.2C4 17.2 7.6 14 12 14s8 3.2 8 7.2a.8.8 0 0 1-.8.8H4.8a.8.8 0 0 1-.8-.8z" stroke="none" style={{ fill: "var(--ic-body, currentColor)", fillOpacity: "var(--ic-body-opacity, 0.4)" }} />
    <circle cx="12" cy="7.5" r="4.5" stroke="none" style={{ fill: "var(--ic-detail, currentColor)", fillOpacity: "var(--ic-detail-opacity, 1)" }} />
  </>
))

export default UserIcon
