import { createContext, useContext } from "react";

// Definição das cores do sistema (Design System)
const defaultTheme = {
  colors: {
    primary: "#2563EB", // Azul Royal (Ação principal)
    primaryDark: "#1E40AF",
    secondary: "#64748B", // Cinza (Texto secundário)
    background: "#F8FAFC", // Fundo claro
    card: "#FFFFFF", // Fundo de cartões/inputs
    text: "#0F172A", // Texto principal
    textInverted: "#FFFFFF", // Texto em cima de botões primários
    border: "#E2E8F0", // Bordas
    error: "#EF4444", // Mensagens de erro
    success: "#10B981", // Mensagens de sucesso
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
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
