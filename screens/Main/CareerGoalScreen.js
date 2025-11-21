import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"; // Removido Alert nativo
import Svg, { Path } from "react-native-svg";
import api from "../../api/apiService";
import { useAlert } from "../../context/AlertContext";
import { useAuth } from "../../context/AuthContext";
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
  const { user } = useAuth();
  const { showAlert } = useAlert();

  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Função auxiliar: Busca ID e garante que é um NÚMERO
  const fetchLatestId = async () => {
    try {
      const response = await api.get("/api/v1/learning-paths?size=1");
      const content = response.data?.content || response.data;
      const latest =
        Array.isArray(content) && content.length > 0 ? content[0] : null;

      // Tenta extrair ID de qualquer campo possível
      const idVal = latest
        ? latest.idTrilha || latest.id || latest.trilhaId
        : 0;
      return Number(idVal); // Força conversão para número para comparação correta
    } catch (error) {
      console.log("Erro ao buscar último ID:", error.message);
      return 0;
    }
  };

  const handleGenerate = async () => {
    if (!goal.trim()) {
      showAlert("Atenção", "Por favor, defina um objetivo de carreira.", {
        style: "default",
      });
      return;
    }

    setLoading(true);
    setStatusMessage("Conectando ao servidor...");
    console.log("--- INÍCIO DO FLUXO DE CRIAÇÃO ---");

    try {
      // 1. Pega o ID atual (Snapshot antes de criar)
      const previousId = await fetchLatestId();
      console.log(`DEBUG: ID Atual (Antes do POST): ${previousId}`);

      const profileJson = await AsyncStorage.getItem("@App:profile");
      const profile = profileJson ? JSON.parse(profileJson) : {};
      const currentRole = profile.jobTitle || "Profissional em transição";

      const payload = {
        cargoAtual: currentRole,
        tituloObjetivo: goal,
      };

      // 2. Envia POST
      const responsePost = await api.post("/api/v1/learning-paths", payload);
      console.log(`DEBUG: POST Status: ${responsePost.status}`);

      if ([200, 201, 202].includes(responsePost.status)) {
        setStatusMessage("Aguardando IA...");

        // 3. Polling para detectar Novo ID (que seja MAIOR que o previousId)
        let foundId = null;
        let attempts = 0;
        const maxAttempts = 10; // Aumentado para dar mais tempo (~20s)

        while (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Espera 2s entre tentativas

          const currentId = await fetchLatestId();
          console.log(
            `DEBUG: Tentativa ${
              attempts + 1
            }: ID no banco = ${currentId} (Anterior: ${previousId})`
          );

          // COMPARAÇÃO NÚMERICA: Se o ID atual for maior que o anterior, é o novo!
          if (currentId > previousId) {
            foundId = currentId;
            break;
          }

          attempts++;
        }

        // Se não achou novo, mas o POST deu 200, tenta usar (previousId + 1) como fallback
        const finalId = foundId || (previousId > 0 ? previousId + 1 : null);

        if (finalId) {
          console.log("DEBUG: SUCESSO! ID Final usado:", finalId);

          // 4. SALVA O ID NA LISTA DO UTILIZADOR (Para aparecer no Dashboard)
          if (user && user.email) {
            const safeEmail = user.email.toLowerCase().trim();
            const storageKey = `@App:myPathIds:${safeEmail}`;

            const storedIds = await AsyncStorage.getItem(storageKey);
            let myIds = storedIds ? JSON.parse(storedIds) : [];

            // Salva como String para padronizar
            const idString = String(finalId);

            if (!myIds.includes(idString)) {
              myIds.push(idString);
              await AsyncStorage.setItem(storageKey, JSON.stringify(myIds));
              console.log("DEBUG: ID salvo localmente na lista de:", safeEmail);
              console.log("DEBUG: Lista atualizada:", myIds);
            }
          }

          navigation.replace("Processing", { pathId: finalId });
        } else {
          console.log("DEBUG: FALHA. Nenhum ID novo detectado. Ativando Demo.");
          navigation.replace("Processing", { isDemo: true });
        }
      }
    } catch (error) {
      console.error("DEBUG ERRO:", error);
      showAlert("Erro", "Não foi possível conectar com o servidor.", {
        style: "destructive",
      });
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
