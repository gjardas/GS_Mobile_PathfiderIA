import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import { AuthProvider } from "./context/AuthContext"; // Importando AuthProvider
import { ThemeProvider } from "./context/ThemeContext";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <ThemeProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </ThemeProvider>
    </NavigationContainer>
  );
}
