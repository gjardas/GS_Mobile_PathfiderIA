import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import api from "../../api/ApiService";
import { useAlert } from "../../context/AlertContext";
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
    loadingText: {
      marginTop: 12,
      textAlign: "center",
      color: theme.colors.mutedForeground,
      fontSize: 12,
    },
  });

export default function CareerGoalScreen({ navigation }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { showAlert } = useAlert();

  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleGenerate = async () => {
    if (!goal.trim()) {
      showAlert("Atenção", "Por favor, defina um objetivo de carreira.", {
        style: "default",
      });
      return;
    }

    setLoading(true);
    setStatusMessage("Conectando ao servidor...");

    try {
      const profileJson = await AsyncStorage.getItem("@App:profile");
      const profile = profileJson ? JSON.parse(profileJson) : {};
      const currentRole = profile.jobTitle || "Profissional em transição";

      const payload = {
        cargoAtual: currentRole,
        tituloObjetivo: goal,
      };

      console.log("Enviando POST...", payload);
      await api.post("/api/v1/learning-paths", payload);

      setStatusMessage("Sincronizando dados...");

      // Aguarda persistência do banco
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // ESTRATÉGIA: Buscar a última trilha criada na lista (sem cache local de IDs)
      console.log("Buscando última trilha na lista...");
      const responseList = await api.get(
        "/api/v1/learning-paths?page=0&size=1&sort=id,desc"
      );

      const content = responseList.data?.content || responseList.data;
      const latestPath =
        Array.isArray(content) && content.length > 0 ? content[0] : null;

      if (latestPath) {
        const finalId = latestPath.idTrilha || latestPath.id;
        console.log("SUCESSO! ID recuperado da API:", finalId);

        // Navega para o processamento (sem salvar ID no storage)
        navigation.replace("Processing", { pathId: finalId });
      } else {
        throw new Error(
          "A trilha foi enviada, mas não apareceu na lista do servidor."
        );
      }
    } catch (error) {
      console.error("ERRO NO PROCESSO:", error);
      const msg =
        error.response?.data?.error || "Erro de conexão. Tente novamente.";
      showAlert("Erro", msg, { style: "destructive" });
    } finally {
      setLoading(false);
      setStatusMessage("");
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
          Para onde quer levar a sua carreira? (Ponto B)
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
          A nossa IA analisará o seu perfil atual para traçar a rota mais
          eficiente.
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

      {loading && <Text style={styles.loadingText}>{statusMessage}</Text>}
    </View>
  );
}
