import * as React from "react"

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, "ref"> {
  /** Width and height. Default 24. */
  size?: number | string
  /** Accessible name. Without it (or aria-label) the icon is decorative and hidden from assistive tech. */
  title?: string
}

export type Icon = React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>

export function createIcon(displayName: string, render: (id: string) => React.ReactNode): Icon {
  const Component = React.forwardRef<SVGSVGElement, IconProps>(function GeneratedIcon(
    { size = 24, title, children, ...props },
    ref,
  ) {
    const id = "gi" + React.useId().replace(/[^a-zA-Z0-9_-]/g, "")
    const labelled = Boolean(title || props["aria-label"] || props["aria-labelledby"])
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        focusable="false"
        role={labelled ? "img" : undefined}
        aria-hidden={labelled ? undefined : true}
        aria-labelledby={title && !props["aria-label"] ? `${id}-title` : undefined}
        {...props}
      >
        {title ? <title id={`${id}-title`}>{title}</title> : null}
        {render(id)}
        {children}
      </svg>
    )
  })
  Component.displayName = displayName
  return Component
}
