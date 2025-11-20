import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import { AlertProvider } from "./context/AlertContext"; // 1. Importar
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <ThemeProvider>
        <AuthProvider>
          <AlertProvider>
            <AppNavigator />
          </AlertProvider>
        </AuthProvider>
      </ThemeProvider>
    </NavigationContainer>
  );
}
