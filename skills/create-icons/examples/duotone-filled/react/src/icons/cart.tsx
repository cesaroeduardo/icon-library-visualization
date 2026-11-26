import { createIcon } from "../create-icon"

/** Cart */
export const CartIcon = createIcon("CartIcon", () => (
  <>
    <path d="M6.6 6h13.7a1 1 0 0 1 1 1.25l-1.6 6.4a2.5 2.5 0 0 1-2.4 1.85H8.6z" stroke="none" style={{ fill: "var(--ic-body, currentColor)", fillOpacity: "var(--ic-body-opacity, 0.4)" }} />
    <path d="M3.6 3.6h1.1a1.2 1.2 0 0 1 1.17.93l2.3 10.6a1.4 1.4 0 0 0 1.37 1.1H18.4" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ic-detail, currentColor)", strokeOpacity: "var(--ic-detail-opacity, 1)" }} />
    <circle cx="9.4" cy="20" r="1.8" stroke="none" style={{ fill: "var(--ic-detail, currentColor)", fillOpacity: "var(--ic-detail-opacity, 1)" }} />
    <circle cx="17.2" cy="20" r="1.8" stroke="none" style={{ fill: "var(--ic-detail, currentColor)", fillOpacity: "var(--ic-detail-opacity, 1)" }} />
  </>
))

export default CartIcon
