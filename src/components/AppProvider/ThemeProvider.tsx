/**
 * Importing npm packages
 */
import { ConfigProvider, type ThemeConfig } from 'antd';
import { useContext, createContext, useState } from 'react';

/**
 *  Importing user defined modules
 */
import { darkTheme, lightTheme } from '@/constants';

/**
 * Declaring types
 */

export type Theme = 'light' | 'dark';

export interface ThemeContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  config: ThemeConfig;
}

export interface ThemeProviderProps {
  children?: React.ReactNode;
}

/**
 * Declaring constants
 */
const themeConfigs: Record<Theme, ThemeConfig> = { light: lightTheme, dark: darkTheme };
const ThemeContext = createContext<ThemeContext>({ theme: 'light', setTheme: () => {}, config: {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider(props: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    let theme = localStorage.getItem('theme') as Theme;
    if (!theme) theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return theme || 'light';
  });

  return (
    <ThemeContext.Provider value={{ theme, setTheme, config: themeConfigs[theme] }}>
      <ConfigProvider theme={themeConfigs[theme]}>{props.children}</ConfigProvider>
    </ThemeContext.Provider>
  );
}
