// eslint-disable-next-line no-restricted-imports
import { Theme, ThemeUIContextValue, useThemeUI } from 'theme-ui';

import {
  alertVariants,
  buttonVariants,
  linkVariants,
  cardVariants,
} from './variants';

const makeTheme = <T extends Theme>(t: T) => t;

const colourTransition = '200ms ease-in-out';
const inputTransition = '0.3s cubic-bezier(.4,0,.2,1)';

const focusStyles = {
  inside: {
    '&:focus, &:focus-within': {
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: 'focusRing',
      outlineOffset: '-2px',
    },
    '&:focus:not(:focus-visible)': {
      outline: 'none',
    },
  },
  outside: {
    '&:focus': {
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: 'focusRing',
    },
    '&:focus:not(:focus-visible)': {
      outline: 'none',
    },
  },
};

const theme = makeTheme({
  breakpoints: [
    '480px',
    '640px',
    '768px',
    '1024px',
    '1280px', // Default design size, and our 'minimum' screen size
    '1430px',
    '1670px',
    '1930px',
  ],
  fonts: {
    body: 'Open Sans, system-ui, sans-serif',
    heading: 'Open Sans, system-ui, sans-serif',
    light: 'Open Sans, system-ui, sans-serif',
  },
  fontSizes: {
    'font-size-md': '14px',
    'font-size-lg': '16px',
    'font-size-xl': '18px',
  },
  fontWeights: {
    'font-weight-normal': 400,
    'font-weight-semi-bold': 600,
    'font-weight-bold': 700,
  },
  lineHeights: {
    body: '20px',
    heading: '24px',
  },
  colors: {
    //  palette
    neutral50: '#F1F2F3',
    neutral100: '#DCE0E5',
    neutral200: '#CBCFD5',
    neutral300: '#B2B7BE',
    neutral400: '#9AA0A7',
    neutral500: '#838991',
    neutral600: '#6C727A',
    neutral700: '#565C63',
    neutral800: '#45474A',
    neutral900: '#2A2B2D',
    accent50: '#E9EFF8',
    accent100: '#DBE3F0',
    accent200: '#CAD6E8',
    accent300: '#A3B6D0',
    accent400: '#6586B0',
    accent500: '#4C6C94',
    accent600: '#415D80',
    accent700: '#3A506F',
    accent800: '#2F415A',
    accent900: '#1C2736',
    brand500: '#EFD338',
    brand100: '#F9F2C2',
    negative500: '#B62039',
    negative100: '#FDDEE3',
    positive500: '#218339',
    positive100: '#DAF1E0',

    //  tokens (use palette color, use the color name as a comment)
    //    text
    textBase: '#2A2B2D', // neutral900
    textSubtle: '#565C63', // neutral700
    textMuted: '#838991', // neutral500
    textBlack: 'black',
    textWhite: 'white',
    textLink: '#415D80', // accent600
    textDisabled: '#9AA0A7', //neutral400
    textPositive: '#218339', // positive500
    textNegative: '#B62039', // negative500

    //    background
    bgPositive: '#DAF1E0', // positive100
    bgNegative: '#FDDEE3', // negative100
    bgSelected: '#E9EFF8', // accent50
    bgPanel: '#F1F2F3', // neutral50

    //    border
    borderPanel: '#CBCFD5', // neutral200
    borderLight: '#DCE0E5', // neutral100
    borderSelected: '#6586B0', // accent400

    //    input
    inputTextPlaceholder: '#838991', // neutral500
    inputBorder: '#9AA0A7', // neutral400
    inputBorderHover: '#6C727A', // neutral600
    inputBorderActive: '#45474A', // neutral800
    inputBorderDisabled: '#CBCFD5', // neutral200

    //    focus
    focusRing: '#6586B0', // accent400
  },
  text: {
    default: {
      color: 'neutral900',
      fontSize: 'font-size-md',
      lineHeight: 'body',
      fontWeight: 'font-weight-normal',
    },
    uppercase: {
      textTransform: 'uppercase',
      letterSpacing: '0.2em',
    },
    capitilize: {
      textTransform: 'capitalize',
    },
    heading: {
      fontFamily: 'heading',
      lineHeight: 'heading',
      fontSize: 'font-size-lg',
      fontWeight: 'font-weight-normal',
      mb: 0,
    },
    bold: {
      fontWeight: 'font-weight-semi-bold',
    },
  },
  focus: { ...focusStyles },
  styles: {
    root: {
      fontSize: 'font-size-md',
      lineHeight: 'body',
      fontFamily: 'body',
      fontWeight: 'font-weight-normal',
    },
    app: {
      bg: '#f5f5f6',
      variant: 'text.default',
    },
    a: {
      color: '#415D80', // accent 600
      textDecoration: 'underline',
      ':hover': {
        textDecoration: 'none',
      },
    },
    h1: {
      variant: 'text.heading',
      fontSize: 'font-size-xl',
    },
    h2: {
      variant: 'text.heading',
    },
    h3: {
      variant: 'text.heading',
      fontSize: 'font-size-md',
      lineHeight: 'body',
      fontWeight: 'font-weight-semi-bold',
    },
    hr: {
      color: '#d7d2cb',
    },
    body: {
      color: 'neutral900',
      variant: 'text.default',
    },
    bodyBold: {
      variant: 'text.bold',
    },
  },
  borderWidths: {
    'border-width-sm': '1px',
    'border-width-md': '2px',
    'border-width-lg': '4px',
  },
  radii: {
    // radii
    'radius-sm': '4px',
    'radius-md': '8px',
    'radius-lg': '16px',
    'radius-xl': '32px',
    'radius-full': '999px',
    // tokens (use the radii above)
    'input-radius': '8px', // radius-md
    'box-radius': '8px', // radius-md
    'box-radius-lg': '16px', //	radius-lg
    'box-radius-xl': '32px', // radius-xl
    'button-radius': '999px', //	radius-full
  },
  sizes: {
    // sizes
    'size-8xs': '16px',
    'size-7xs': '24px',
    'size-6xs': '32px',
    'size-5xs': '40px',
    'size-4xs': '48px',
    'size-3xs': '72px',
    'size-2xs': '96px',
    'size-xs': '192px',
    'size-sm': '240px',
    'size-md': '320px',
    'size-lg': '400px',
    'size-xl': '640px',
    'size-2xl': '768px',
    'size-3xl': '960px',
    'size-4xl': '1280px',
    'size-5xl': '1440px',
    'size-6xl': '1600px',
    'size-7xl': '1760px',
    // tokens (use size from above)
    'input-height': '40px', // size-5xs
    'button-height': '40px', // size-5xs
    'container-xs': '320px', // size-md
    'container-sm': '400px', // size-lg
    'container-md': '768px', // size-2xl
    'container-lg': '960px', // size-3xl
    'container-xl': '1280px', // size-4xl
    'dialog-xs': '480px',
    'dialog-sm': '600px',
    'dialog-md': '768px',
    'dialog-lg': '960px',
    'dialog-xl': '1200px',
  },
  shadows: {
    'shadow-xs': '0 1px 2px 0 rgba(0,0,0,0.15)',
    'shadow-sm': '0 3px 6px 0 rgba(0,0,0,0.15)',
    'shadow-md':
      '0 28px 38px 0 rgba(0,0,0,0.07), 0 12px 16px 0 rgba(0,0,0,0.05), 0 6px 8px 0 rgba(0,0,0,0.04), 0 3px 5px 0 rgba(0,0,0,0.04), 0 2px 4px 0 rgba(0,0,0,0.03), 0 0 1px 0 rgba(0,0,0,0.02)',
    'shadow-lg':
      '0 100px 80px 0 rgba(0,0,0,0.07), 0 42px 33px 0 rgba(0,0,0,0.05), 0 22px 18px 0 rgba(0,0,0,0.04), 0 13px 10px 0 rgba(0,0,0,0.04), 0 7px 5px 0 rgba(0,0,0,0.03), 0 3px 2px 0 rgba(0,0,0,0.02)',
  },
  space: {
    'spacing-3xs': '2px',
    'spacing-2xs': '4px',
    'spacing-xs': '8px',
    'spacing-sm': '12px',
    'spacing-md': '16px',
    'spacing-lg': '24px',
    'spacing-xl': '32px',
    'spacing-2xl': '48px',
    'spacing-3xl': '64px',
    'spacing-4xl': '96px',
    'spacing-5xl': '128px',
  },
  transitions: {
    colorFade: `background ${colourTransition}, background-color ${colourTransition}, border-color ${colourTransition}, color ${colourTransition}`,
    inputTransitions: `background-color ${inputTransition}, border-color ${inputTransition}, color ${inputTransition}, fill ${inputTransition}, stroke ${inputTransition}, opacity ${inputTransition}, box-shadow ${inputTransition}, transform ${inputTransition}`,
  },
  zIndices: {
    table: 10,
    inputModal: 20,
    overlay: 30,
    notification: 100,
  },
  // variants
  alerts: alertVariants,
  buttons: buttonVariants,
  links: linkVariants,
  cards: cardVariants,
});

export type UTheme = typeof theme;
interface UThemeContextValue extends Omit<ThemeUIContextValue, 'theme'> {
  theme: UTheme;
}
export const useTheme = useThemeUI as unknown as () => UThemeContextValue;

export default theme;
