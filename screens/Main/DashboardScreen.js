import AsyncStorage from "@react-native-async-storage/async-storage"; // <--- Import adicionado
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import api from "../../api/apiService";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: theme.spacing.l,
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 60,
    },
    greetingLabel: {
      fontSize: 14,
      color: theme.colors.mutedForeground,
    },
    username: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.foreground,
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 15,
    },
    aboutButton: {
      padding: 8,
    },
    aboutIcon: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.primary,
    },
    logoutButton: {
      padding: 8,
    },
    logoutText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.destructive,
    },
    content: {
      padding: theme.spacing.l,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.foreground,
      marginTop: theme.spacing.l,
      marginBottom: theme.spacing.m,
    },
    primaryCard: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.spacing.m,
      padding: theme.spacing.l,
      marginBottom: theme.spacing.m,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    primaryCardTitle: {
      color: theme.colors.primaryForeground,
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 4,
    },
    primaryCardSubtitle: {
      color: theme.colors.primaryForeground,
      opacity: 0.8,
      fontSize: 14,
    },
    secondaryCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.spacing.m,
      padding: theme.spacing.l,
      marginBottom: theme.spacing.m,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    secondaryCardTitle: {
      color: theme.colors.foreground,
      fontSize: 18,
      fontWeight: "600",
    },
    secondaryCardSubtitle: {
      color: theme.colors.mutedForeground,
      fontSize: 14,
    },
    pathCard: {
      backgroundColor: theme.colors.card,
      padding: theme.spacing.m,
      borderRadius: theme.spacing.m,
      marginBottom: theme.spacing.s,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    pathTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.foreground,
    },
    pathStatus: {
      fontSize: 12,
      marginTop: 4,
      fontWeight: "500",
    },
    emptyState: {
      padding: theme.spacing.xl,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.muted,
      borderRadius: theme.spacing.m,
      borderStyle: "dashed",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  });

export default function DashboardScreen({ navigation }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { user, signOut } = useAuth();

  // Estado local para o nome, inicializado com o do login
  const [displayName, setDisplayName] = useState(user?.name || "Profissional");
  const [recentPaths, setRecentPaths] = useState([]);
  const [loadingPaths, setLoadingPaths] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // Carrega trilhas e o perfil atualizado ao focar na tela
      loadData();
    }, [])
  );

  const loadData = async () => {
    setLoadingPaths(true);
    try {
      // 1. Atualiza Nome do Perfil
      const storedProfile = await AsyncStorage.getItem("@App:profile");
      if (storedProfile) {
        const profileData = JSON.parse(storedProfile);
        if (profileData.name) {
          setDisplayName(profileData.name);
        }
      }

      // 2. Carrega Trilhas da API
      const response = await api.get("/api/v1/learning-paths");
      const paths = response.data?.content || [];
      setRecentPaths(paths);
    } catch (error) {
      console.log("Erro ao carregar dados:", error);
    } finally {
      setLoadingPaths(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja desconectar?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: signOut },
    ]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CONCLUIDA":
        return theme.colors.success || "#10B981";
      case "PROCESSANDO":
        return "#F59E0B";
      case "ERRO":
        return theme.colors.destructive;
      default:
        return theme.colors.mutedForeground;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingLabel}>Bem-vindo,</Text>
          {/* Usa o estado local displayName que atualiza ao voltar do perfil */}
          <Text style={styles.username}>{displayName}</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.aboutButton}
            onPress={() => navigation.navigate("About")}
          >
            <Text style={styles.aboutIcon}>i</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>SAIR</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.primaryCard}
          onPress={() => navigation.navigate("CareerGoal")}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={styles.primaryCardTitle}>
                Nova Trilha de Carreira
              </Text>
              <Text style={styles.primaryCardSubtitle}>
                Use IA para planejar seu futuro
              </Text>
            </View>
            <Svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={theme.colors.primaryForeground}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </Svg>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryCard}
          onPress={() => navigation.navigate("Profile")}
        >
          <View>
            <Text style={styles.secondaryCardTitle}>Meu Perfil</Text>
            <Text style={styles.secondaryCardSubtitle}>
              Gerencie cargo e habilidades
            </Text>
          </View>
          <Svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme.colors.mutedForeground}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Circle cx="12" cy="8" r="5" />
            <Path d="M20 21a8 8 0 1 0-16 0" />
          </Svg>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Trilhas Recentes</Text>

        {loadingPaths ? (
          <ActivityIndicator
            color={theme.colors.primary}
            style={{ margin: 20 }}
          />
        ) : recentPaths.length > 0 ? (
          recentPaths.map((path) => (
            <TouchableOpacity
              key={path.idTrilha}
              style={styles.pathCard}
              onPress={() => {
                if (
                  path.status === "PROCESSANDO" ||
                  path.status === "PENDENTE"
                ) {
                  navigation.navigate("Processing", { pathId: path.idTrilha });
                } else {
                  navigation.navigate("LearningPath", { pathData: path });
                }
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.pathTitle}>{path.tituloObjetivo}</Text>
                <Text
                  style={[
                    styles.pathStatus,
                    { color: getStatusColor(path.status) },
                  ]}
                >
                  {path.status}
                </Text>
              </View>
              <Svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={theme.colors.mutedForeground}
                strokeWidth="2"
              >
                <Path d="m9 18 6-6-6-6" />
              </Svg>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text
              style={{
                color: theme.colors.mutedForeground,
                textAlign: "center",
              }}
            >
              Você ainda não gerou nenhuma trilha.
              {"\n"}Toque no cartão azul para começar!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
