import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

// Importando as telas (Placeholders)
import WelcomeScreen from "../screens/Auth/WelcomeScreen";
import DashboardScreen from "../screens/Main/DashboardScreen";

const Stack = createStackNavigator();

// Pilha de Autenticação (Telas Públicas)
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
  </Stack.Navigator>
);

// Pilha Principal (Telas Privadas)
const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    {/* Futuramente adicionaremos: Onboarding, CareerGoal, Processing, LearningPath, Profile */}
  </Stack.Navigator>
);

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        setIsAuthenticated(!!token); // Se tiver token, true. Se não, false.
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="App" component={AppStack} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
