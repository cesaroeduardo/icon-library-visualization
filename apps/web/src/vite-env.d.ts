/// <reference types="vite/client" />

declare module '@icon-library/core' {
  export function prepareSvg(
    svgString: string,
    options?: { color?: string; dimension?: number | string; colored?: boolean }
  ): string
}
