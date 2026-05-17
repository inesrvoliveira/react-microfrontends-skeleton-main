import { ThemeUIStyleObject } from 'theme-ui';

type CardVariants = 'primary' | 'secondary' | 'outlined';

const commonCardStyles = {
  color: 'body',
  borderWidth: 'border-width-sm',
  borderStyle: 'solid',
  borderRadius: 'radius-md',
  fontWeight: 'font-weight-normal',
};

export const cardVariants: Record<CardVariants, ThemeUIStyleObject> = {
  primary: {
    ...commonCardStyles,
    bg: 'neutral50',
    borderColor: 'neutral50',
  },
  secondary: {
    ...commonCardStyles,
    bg: 'white',
    borderColor: 'white',
  },
  outlined: {
    ...commonCardStyles,
    bg: 'transparent',
    borderColor: 'neutral200',
  },
};
