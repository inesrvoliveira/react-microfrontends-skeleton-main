/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThemeUIStyleObject } from 'theme-ui';
type ButtonVariants = 'primary' | 'secondary' | 'tertiary' | 'icon';

const getCommonButtonStyles: ThemeUIStyleObject = {
  fontWeight: 'font-weight-semi-bold',
  borderRadius: 'radius-full',
  textAlign: 'center',
  '&[aria-disabled="true"]': {
    '&:focus': {
      outline: 'unset',
      outlineOffset: 'unset',
    },
    '&:hover, &:focus-visible': {
      bg: 'transparent',
    },
    bg: 'transparent',
    color: 'textDisabled',
    cursor: 'not-allowed',
  },
  whiteSpace: 'nowrap',
  lineHeight: 'body',
  fontSize: '14px',
  height: 'button-height',
  px: 'spacing-lg',
  '&:focus': (theme: any) => theme.focus.outside['&:focus'],
  '&:focus:not(:focus-visible)': (theme: any) =>
    theme.focus.outside['&:focus:not(:focus-visible)'],
};

export const buttonVariants: Record<ButtonVariants, ThemeUIStyleObject> = {
  primary: {
    ...getCommonButtonStyles,
    bg: 'black',
    color: 'white',
    minWidth: '72px',
    '&:hover, &:focus-visible': {
      bg: 'neutral900',
    },
  },
  secondary: {
    ...getCommonButtonStyles,
    color: 'accent800',
    bg: 'accent100',
    minWidth: '72px',
    '&:hover, &:focus-visible': {
      bg: 'accent200',
    },
  },
  tertiary: {
    ...getCommonButtonStyles,
    color: 'accent800',
    bg: 'white',
    minWidth: 'auto',
    '&:hover, &:focus-visible': {
      bg: 'neutral100',
    },
  },
  icon: {
    ...getCommonButtonStyles,
    minWidth: 'auto',
    bg: 'transparent',
    color: 'black',
    '&:hover': {
      bg: 'neutral100',
    },
    '&[aria-disabled="true"]': {
      color: 'textDisabled',
      cursor: 'not-allowed',
      '&:hover': {
        bg: 'unset',
      },
    },
    '&[aria-pressed="true"]': {
      bg: 'bgSelected',
      color: 'accent600',
      '&:hover': {
        bg: 'neutral100',
      },
    },
  },
};
