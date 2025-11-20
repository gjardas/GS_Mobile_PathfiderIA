import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"; // Removido Alert
import Svg, { Path } from "react-native-svg";
import api from "../../api/apiService";
import { useAlert } from "../../context/AlertContext"; // Import Hook
import { useTheme } from "../../context/ThemeContext";

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.l,
      justifyContent: "center",
    },
    backButton: {
      position: "absolute",
      top: 60,
      left: 20,
      zIndex: 10,
      padding: 8,
    },
    header: {
      marginBottom: theme.spacing.xl,
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
    },
    inputContainer: {
      marginBottom: theme.spacing.xl,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.foreground,
      marginBottom: theme.spacing.s,
    },
    input: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.spacing.s,
      padding: 16,
      fontSize: 18,
      color: theme.colors.foreground,
    },
    helperText: {
      marginTop: 8,
      fontSize: 12,
      color: theme.colors.mutedForeground,
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 18,
      borderRadius: theme.spacing.s,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 10,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
    },
    buttonText: {
      color: theme.colors.primaryForeground,
      fontSize: 18,
      fontWeight: "bold",
    },
  });

export default function CareerGoalScreen({ navigation }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { showAlert } = useAlert(); // Use Hook

  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!goal.trim()) {
      showAlert("Atenção", "Por favor, defina um objetivo de carreira.", {
        style: "default",
      });
      return;
    }

    setLoading(true);
    console.log("CONSOLE LOG: Iniciando fluxo de criação...");

    try {
      // 1. Tenta pegar o cargo atual do perfil salvo localmente
      const profileJson = await AsyncStorage.getItem("@App:profile");
      const profile = profileJson ? JSON.parse(profileJson) : {};
      const currentRole = profile.jobTitle || "Profissional em transição";

      // 2. Prepara o JSON para o Java
      const payload = {
        cargoAtual: currentRole,
        tituloObjetivo: goal,
      };

      // 3. Envia requisição de criação (POST)
      const responsePost = await api.post("/api/v1/learning-paths", payload);
      console.log("CONSOLE LOG: POST status:", responsePost.status);

      // Aceita 200, 201 ou 202 como sucesso
      if ([200, 201, 202].includes(responsePost.status)) {
        // --- TRUQUE PARA PEGAR O ID ---
        // Como o POST retorna Void, buscamos a última trilha criada (ordenada por ID DESC)
        console.log("CONSOLE LOG: Buscando ID da trilha recém-criada...");

        // Aguarda 1.5 segundos para garantir que o banco processou a inserção
        await new Promise((resolve) => setTimeout(resolve, 1500));

        try {
          const responseGet = await api.get("/api/v1/learning-paths?size=1");

          // A resposta do Spring Pageable geralmente vem em .content
          const latestPath = responseGet.data?.content
            ? responseGet.data.content[0]
            : null;

          if (latestPath && latestPath.idTrilha) {
            console.log("CONSOLE LOG: ID encontrado:", latestPath.idTrilha);
            // Navega para o processamento com o ID real
            navigation.replace("Processing", { pathId: latestPath.idTrilha });
          } else {
            // Fallback: Se não encontrar, vai para modo Demo para não travar
            console.log(
              "CONSOLE LOG: ID não encontrado na listagem. Usando modo Demo."
            );
            navigation.replace("Processing", { isDemo: true });
          }
        } catch (getError) {
          console.log("Erro ao buscar ID:", getError);
          // Se der erro no GET, vai para o Dashboard avisando que iniciou
          showAlert(
            "Processamento Iniciado",
            "Sua trilha está sendo gerada! Você poderá vê-la na lista em breve.",
            { onPress: () => navigation.navigate("Dashboard") }
          );
        }
      }
    } catch (error) {
      console.error("CONSOLE LOG ERRO:", error);
      showAlert("Erro", "Não foi possível conectar com o servidor.", {
        style: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={theme.colors.foreground}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M19 12H5" />
          <Path d="m12 19-7-7 7-7" />
        </Svg>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Defina seu Objetivo</Text>
        <Text style={styles.subtitle}>
          Para onde você quer levar sua carreira? (Ponto B)
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Cargo ou Habilidade Alvo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Arquiteto de Soluções Cloud"
          placeholderTextColor={theme.colors.mutedForeground}
          value={goal}
          onChangeText={setGoal}
          autoFocus
        />
        <Text style={styles.helperText}>
          Nossa IA analisará seu perfil atual para traçar a rota mais eficiente.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleGenerate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.primaryForeground} />
        ) : (
          <>
            <Text style={styles.buttonText}>Gerar Trilha</Text>
            <Svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={theme.colors.primaryForeground}
              strokeWidth="2"
            >
              <Path d="m12 3-1.9 5.8a2 2 0 0 1-1.2 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
            </Svg>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
