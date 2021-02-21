export const mediaSize = {
  mobile: '@media all and (max-width: 577px)',
  tablet: '@media all and (max-width: 767px)',
  media2x: '@media all and (min-width: 2400px)',
  media3x: '@media all and (min-width: 3200px)',
}

export const withMedia = (selector, prop, [general, media2x, media3x, mobile]) => `
  ${selector ? `${selector} {` : ''}
    ${general ? `${prop}: ${general};` : ''}
    ${mobile ? `${mediaSize.mobile} { ${prop}: ${mobile}; }` : ''}
    ${media2x ? `${mediaSize.media2x} { ${prop}: ${media2x}; }` : ''}
    ${media3x ? `${mediaSize.media3x} { ${prop}: ${media3x}; }` : ''}
  ${selector ? '}' : ''}
`

export const withMobile = (props, value) => `
  ${props.map((prop, idx) => `@media all and (max-width: 577px) { ${prop}: ${value[idx]} }`)}
`

export const fontNormal = withMedia(null, 'font-size', ['16px', '24px', '32px', '12px'])
export const fontTitle = withMedia(null, 'font-size', ['24px', '32px', '48px', '18px'])
export const fontSmall = withMedia(null, 'font-size', ['12px', '18px', '24px', '10px'])
