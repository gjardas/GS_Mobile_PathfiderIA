import { createContext, useContext } from "react";

const defaultTheme = {
  colors: {
    background: "#FFFFFF",
    foreground: "#020817",

    primary: "#0F172A",
    primaryForeground: "#F8FAFC",

    secondary: "#F1F5F9",
    secondaryForeground: "#0F172A",

    muted: "#F1F5F9",
    mutedForeground: "#64748B",

    border: "#E2E8F0",
    card: "#FFFFFF",

    destructive: "#EF4444",
    destructiveForeground: "#FFFFFF",
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  utils: {
    hexToRgba: (hex, opacity) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `rgba(${parseInt(result[1], 16)}, ${parseInt(
            result[2],
            16
          )}, ${parseInt(result[3], 16)}, ${opacity})`
        : null;
    },
  },
};

const ThemeContext = createContext({ theme: defaultTheme });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={{ theme: defaultTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
