import { createIcon } from "../create-icon"

/** Cart */
export const CartIcon = createIcon("CartIcon", () => (
  <>
    <path d="M3 3.5h2l2.2 11.1a1.5 1.5 0 0 0 1.5 1.2h8.7a1.5 1.5 0 0 0 1.5-1.1L20.5 7.5H6" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ic-line, currentColor)", strokeOpacity: "var(--ic-line-opacity, 1)" }} />
    <circle cx="9.5" cy="19.8" r="1.1" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ic-line, currentColor)", strokeOpacity: "var(--ic-line-opacity, 1)" }} />
    <circle cx="17" cy="19.8" r="1.1" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--ic-line, currentColor)", strokeOpacity: "var(--ic-line-opacity, 1)" }} />
  </>
))

export default CartIcon
