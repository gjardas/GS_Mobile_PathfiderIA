import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import api from "../../api/apiService";
import { useAlert } from "../../context/AlertContext";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const createStyles = (theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
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
    greetingLabel: { fontSize: 14, color: theme.colors.mutedForeground },
    username: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.foreground,
    },
    headerActions: { flexDirection: "row", alignItems: "center", gap: 15 },
    aboutButton: { padding: 8 },
    aboutIcon: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.primary,
    },
    logoutButton: { padding: 8 },
    logoutText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.destructive,
    },
    content: { padding: theme.spacing.l },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.foreground,
      marginTop: theme.spacing.l,
      marginBottom: theme.spacing.m,
    },

    // Card Principal (Azul)
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

    // Card Secundário (Perfil)
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

    // Card de Trilha
    pathCard: {
      backgroundColor: theme.colors.card,
      padding: theme.spacing.m,
      borderRadius: theme.spacing.m,
      marginBottom: theme.spacing.s,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: "column",
    },
    pathHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    pathTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.foreground,
      flex: 1,
    },
    pathStatus: { fontSize: 12, fontWeight: "600" },

    // Barras de Progresso
    miniProgressContainer: {
      height: 4,
      backgroundColor: theme.colors.muted,
      borderRadius: 2,
      width: "100%",
      overflow: "hidden",
    },
    miniProgressBar: {
      height: "100%",
      backgroundColor: theme.colors.success || "#10B981",
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
  const { showAlert } = useAlert();

  const [displayName, setDisplayName] = useState(user?.name || "Profissional");
  const [recentPaths, setRecentPaths] = useState([]);
  const [loadingPaths, setLoadingPaths] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Recarrega sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData().then(() => setRefreshing(false));
  }, []);

  const loadData = async () => {
    if (!refreshing) setLoadingPaths(true);

    try {
      // 1. Carregar Nome do Perfil (Atualizado)
      const storedProfile = await AsyncStorage.getItem("@App:profile");
      if (storedProfile) {
        const profileData = JSON.parse(storedProfile);
        if (profileData.name) setDisplayName(profileData.name);
      }

      // 2. Carregar a lista de IDs de trilhas "Meus"
      let myPathIds = [];
      if (user && user.email) {
        // Normaliza o email para garantir consistência na chave
        const safeEmail = user.email.toLowerCase().trim();
        const storedIds = await AsyncStorage.getItem(
          `@App:myPathIds:${safeEmail}`
        );
        myPathIds = storedIds ? JSON.parse(storedIds) : [];
        console.log("Dashboard - Meus IDs:", myPathIds);
      }

      // 3. Buscar TODAS as trilhas da API
      const response = await api.get("/api/v1/learning-paths");
      // Suporte para resposta paginada do Spring (.content) ou lista direta
      const apiPaths = response.data?.content || response.data || [];

      // 4. Filtrar: Mostrar apenas as trilhas que estão na minha lista local
      const myPaths = apiPaths.filter((path) => {
        // Converte tudo para String para evitar erro de comparação (15 vs "15")
        const pId = String(path.idTrilha || path.id || path.trilhaId);
        return myPathIds.map(String).includes(pId);
      });

      // 5. Calcular o progresso visual para cada trilha
      const enrichedPaths = await Promise.all(
        myPaths.map(async (path) => {
          const pId = path.idTrilha || path.id || path.trilhaId;

          // Se ainda não está pronta, retorna status de processamento
          if (path.status !== "CONCLUIDA") {
            return {
              ...path,
              userProgress: 0,
              displayStatus: "Processando IA...",
            };
          }

          try {
            // Calcula total de passos do JSON da IA
            let totalSteps = 0;
            if (path.dadosJsonIA) {
              let raw = path.dadosJsonIA;
              // Fallback para string JSON (caso o backend mande string)
              if (typeof raw === "string") {
                raw = raw
                  .replace(/```json/g, "")
                  .replace(/```/g, "")
                  .trim();
                try {
                  raw = JSON.parse(raw);
                } catch (e) {}
              }

              if (Array.isArray(raw)) {
                totalSteps = raw.length;
              } else if (typeof raw === "object") {
                // Procura pela lista em várias chaves possíveis
                const list =
                  raw.steps ||
                  raw.trilha ||
                  raw.passos ||
                  raw.path ||
                  raw.data ||
                  [];
                totalSteps = list.length;
              }
            }

            // Lê os passos marcados como "feitos" no AsyncStorage
            const savedProgress = await AsyncStorage.getItem(
              `@PathProgress:${pId}`
            );
            const completedSet = savedProgress ? JSON.parse(savedProgress) : [];
            const completedCount = completedSet.length;

            // Calcula porcentagem (0 a 100)
            const percent =
              totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

            let statusText = "Não Iniciada";
            if (percent === 100) statusText = "🏆 Finalizada";
            else if (percent > 0)
              statusText = `Em Andamento (${Math.round(percent)}%)`;

            return {
              ...path,
              userProgress: percent,
              displayStatus: statusText,
            };
          } catch (e) {
            return {
              ...path,
              userProgress: 0,
              displayStatus: "Erro ao calcular",
            };
          }
        })
      );

      // Ordena para mostrar as mais recentes primeiro (assumindo ID incremental)
      enrichedPaths.sort((a, b) => (b.idTrilha || 0) - (a.idTrilha || 0));

      setRecentPaths(enrichedPaths);
    } catch (error) {
      console.log("Erro ao carregar dashboard:", error);
    } finally {
      setLoadingPaths(false);
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    showAlert("Sair", "Tem certeza que deseja desconectar?", {
      text: "Sair",
      style: "destructive",
      cancelText: "Cancelar",
      onPress: signOut,
    });
  };

  const getStatusColor = (path) => {
    if (path.status === "PROCESSANDO") return "#F59E0B"; // Laranja
    if (path.userProgress === 100) return theme.colors.success || "#10B981"; // Verde
    if (path.userProgress > 0) return theme.colors.primary; // Azul
    return theme.colors.mutedForeground; // Cinza
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingLabel}>Bem-vindo,</Text>
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

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
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

        <Text style={styles.sectionTitle}>Minhas Trilhas</Text>

        {loadingPaths && !refreshing ? (
          <ActivityIndicator
            color={theme.colors.primary}
            style={{ margin: 20 }}
          />
        ) : recentPaths.length > 0 ? (
          recentPaths.map((path) => (
            <TouchableOpacity
              key={path.idTrilha || path.id}
              style={styles.pathCard}
              onPress={() => {
                const pId = path.idTrilha || path.id || path.trilhaId;
                if (
                  path.status === "PROCESSANDO" ||
                  path.status === "PENDENTE"
                ) {
                  navigation.navigate("Processing", { pathId: pId });
                } else {
                  navigation.navigate("LearningPath", { pathData: path });
                }
              }}
            >
              <View style={styles.pathHeader}>
                <Text style={styles.pathTitle}>{path.tituloObjetivo}</Text>
                <Text
                  style={[styles.pathStatus, { color: getStatusColor(path) }]}
                >
                  {path.displayStatus}
                </Text>
                <Svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={theme.colors.mutedForeground}
                  strokeWidth="2"
                  style={{ marginLeft: 8 }}
                >
                  <Path d="m9 18 6-6-6-6" />
                </Svg>
              </View>

              {path.status === "CONCLUIDA" && (
                <View style={styles.miniProgressContainer}>
                  <View
                    style={[
                      styles.miniProgressBar,
                      { width: `${path.userProgress || 0}%` },
                    ]}
                  />
                </View>
              )}
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
