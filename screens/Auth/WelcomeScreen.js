import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// 1. Importar componentes do react-native-svg
import Svg, { Circle, Polygon } from "react-native-svg";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flexGrow: 1,
      justifyContent: "center",
      padding: theme.spacing.l,
    },
    header: {
      alignItems: "center",
      marginBottom: theme.spacing.xl,
      marginTop: 40,
    },
    logoCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.m,
      // Adiciona uma sombra suave para destacar o ícone
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.foreground,
      marginBottom: theme.spacing.s,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.mutedForeground,
      textAlign: "center",
    },
    tabContainer: {
      flexDirection: "row",
      marginBottom: theme.spacing.l,
      backgroundColor: theme.colors.muted,
      borderRadius: theme.spacing.s,
      padding: 4,
    },
    tabButton: {
      flex: 1,
      paddingVertical: 8,
      alignItems: "center",
      borderRadius: theme.spacing.s - 4,
    },
    activeTab: {
      backgroundColor: theme.colors.background,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    tabText: {
      fontWeight: "500",
      color: theme.colors.mutedForeground,
    },
    activeTabText: {
      color: theme.colors.foreground,
      fontWeight: "600",
    },
    form: {
      padding: theme.spacing.s,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.foreground,
      marginBottom: theme.spacing.s,
      marginTop: theme.spacing.m,
    },
    input: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.spacing.s,
      padding: 12,
      fontSize: 16,
      color: theme.colors.foreground,
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 16,
      borderRadius: theme.spacing.s,
      alignItems: "center",
      marginTop: theme.spacing.xl,
    },
    primaryButtonText: {
      color: theme.colors.primaryForeground,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

export default function WelcomeScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { signIn } = useAuth();

  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || (activeTab === "register" && !name)) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password, activeTab === "register" ? name : "");
    } catch (error) {
      Alert.alert("Erro", "Falha na autenticação.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          {/* 2. Aqui está o seu ícone SVG implementado */}
          <View style={styles.logoCircle}>
            <Svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke={theme.colors.primaryForeground} // Usa a cor clara do tema
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Circle cx="12" cy="12" r="10" />
              <Polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </Svg>
          </View>

          <Text style={styles.title}>Pathfinder AI</Text>
          <Text style={styles.subtitle}>Seu GPS de Carreira Inteligente</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "login" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("login")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "login" && styles.activeTabText,
              ]}
            >
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "register" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("register")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "register" && styles.activeTabText,
              ]}
            >
              Registrar
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 10,
              color: theme.colors.foreground,
            }}
          >
            {activeTab === "login" ? "Bem-vindo de volta" : "Criar conta"}
          </Text>

          {activeTab === "register" && (
            <>
              <Text style={styles.inputLabel}>Nome</Text>
              <TextInput
                style={styles.input}
                placeholder="Seu nome completo"
                placeholderTextColor={theme.colors.mutedForeground}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </>
          )}

          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            placeholderTextColor={theme.colors.mutedForeground}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.inputLabel}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={theme.colors.mutedForeground}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={[styles.primaryButton, isLoading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading
                ? "Processando..."
                : activeTab === "login"
                ? "Entrar"
                : "Criar Conta"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
