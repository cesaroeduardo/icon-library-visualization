import { createIcon } from "../create-icon"

/** Notifications */
export const BellIcon = createIcon("BellIcon", () => (
  <>
    <path d="M12 3a6.5 6.5 0 0 1 6.5 6.5V12h-13V9.5A6.5 6.5 0 0 1 12 3z" stroke="none" style={{ fill: "var(--ic-body, currentColor)", fillOpacity: "var(--ic-body-opacity, 0.4)" }} />
    <path d="M5.5 11h13v2.1l1.6 2.6A1.5 1.5 0 0 1 18.8 18H5.2a1.5 1.5 0 0 1-1.3-2.3l1.6-2.6z" stroke="none" style={{ fill: "var(--ic-detail, currentColor)", fillOpacity: "var(--ic-detail-opacity, 1)" }} />
    <path d="M9.4 19.2h5.2a2.6 2.6 0 0 1-5.2 0z" stroke="none" style={{ fill: "var(--ic-detail, currentColor)", fillOpacity: "var(--ic-detail-opacity, 1)" }} />
  </>
))

export default BellIcon
