import React from 'react';
import { ThemeUIProvider, Theme, ThemeUIStyleObject, merge } from 'theme-ui';

import theme from '../theme';

interface IAppThemeProviderProps {
  themeOverrides?: Theme;
  variants?: Record<string, unknown | ThemeUIStyleObject>;
  children: React.ReactNode;
}

const AppThemeProvider = ({
  themeOverrides = {},
  variants = {},
  children,
}: IAppThemeProviderProps) => (
  <ThemeUIProvider
    theme={{
      ...merge(theme, themeOverrides),
      ...variants,
    }}
  >
    {children}
  </ThemeUIProvider>
);

export default AppThemeProvider;
