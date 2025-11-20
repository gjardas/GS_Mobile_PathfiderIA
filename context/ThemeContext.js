import { createContext, useContext } from "react";

// Conversão dos valores HSL do Shadcn para HEX
const defaultTheme = {
  colors: {
    // Light Mode Values
    background: "#FFFFFF", // 0 0% 100%
    foreground: "#020817", // 222.2 84% 4.9% (Azul quase preto)

    primary: "#0F172A", // 222.2 47.4% 11.2% (Azul Escuro Principal)
    primaryForeground: "#F8FAFC", // 210 40% 98% (Quase branco)

    secondary: "#F1F5F9", // 210 40% 96.1%
    secondaryForeground: "#0F172A",

    muted: "#F1F5F9", // 210 40% 96.1%
    mutedForeground: "#64748B", // 215.4 16.3% 46.9% (Cinza médio)

    border: "#E2E8F0", // 214.3 31.8% 91.4% (Cinza claro)
    card: "#FFFFFF",

    destructive: "#EF4444", // Vermelho padrão para erros
    destructiveForeground: "#FFFFFF",
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  // Utilitário para opacidade (simulando o /10, /30 do Tailwind)
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
