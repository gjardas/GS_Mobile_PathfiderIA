import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

// --- IMPORTAÇÕES DAS TELAS ---

// Auth (Público)
import WelcomeScreen from "../screens/Auth/WelcomeScreen";

// Main (Privado)
import AboutScreen from "../screens/Main/AboutScreen"; // 1. Importação da nova tela
import CareerGoalScreen from "../screens/Main/CareerGoalScreen";
import DashboardScreen from "../screens/Main/DashboardScreen";
import LearningPathScreen from "../screens/Main/LearningPathScreen";
import ProcessingScreen from "../screens/Main/ProcessingScreen";
import ProfileScreen from "../screens/Main/ProfileScreen";

const Stack = createStackNavigator();

// Stack para usuários NÃO logados (Público)
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
  </Stack.Navigator>
);

// Stack para usuários LOGADOS (Privado)
const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="CareerGoal" component={CareerGoalScreen} />
    <Stack.Screen name="Processing" component={ProcessingScreen} />
    <Stack.Screen name="LearningPath" component={LearningPathScreen} />

    {/* 2. Registro da rota About */}
    <Stack.Screen name="About" component={AboutScreen} />
  </Stack.Navigator>
);

export default function AppNavigator() {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0F172A" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {signed ? (
        <Stack.Screen name="App" component={AppStack} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
