import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import api from "../../api/apiService";
import { useTheme } from "../../context/ThemeContext";

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.xl,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.foreground,
      marginTop: theme.spacing.l,
      marginBottom: theme.spacing.s,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.mutedForeground,
      textAlign: "center",
      lineHeight: 24,
    },
    stepContainer: {
      marginTop: theme.spacing.xl,
      padding: theme.spacing.m,
      backgroundColor: theme.colors.muted,
      borderRadius: theme.spacing.m,
      width: "100%",
      alignItems: "center",
    },
    stepText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.primary,
    },
  });

export default function ProcessingScreen({ navigation, route }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { pathId } = route.params || {}; // Proteção caso venha sem params

  const [statusText, setStatusText] = useState("Inicializando...");

  useEffect(() => {
    // Animação de texto simples
    const steps = [
      "Analisando seu perfil atual...",
      "Mapeando gaps de competência...",
      "Consultando tendências de mercado...",
      "Estruturando plano de aprendizado...",
    ];

    let stepIndex = 0;
    const textInterval = setInterval(() => {
      setStatusText(steps[stepIndex]);
      stepIndex = (stepIndex + 1) % steps.length;
    }, 2500);

    // POLLING: Verifica status no backend a cada 3s
    const checkStatus = async () => {
      if (!pathId) return; // Se não tem ID, não tem o que checar

      try {
        const response = await api.get(`/api/v1/learning-paths/${pathId}`);
        const data = response.data;

        // Ajuste conforme o retorno do seu Java.
        // Geralmente verificamos se o status é 'CONCLUIDA' ou se o JSON da IA já existe.
        if (
          data.status === "CONCLUIDA" ||
          (data.dadosJsonIA && data.dadosJsonIA.length > 10)
        ) {
          clearInterval(pollingInterval);
          clearInterval(textInterval);
          // Navega para o resultado passando os dados
          navigation.replace("LearningPath", { pathData: data });
        }
      } catch (error) {
        console.log("Aguardando processamento...");
      }
    };

    const pollingInterval = setInterval(checkStatus, 3000);

    return () => {
      clearInterval(pollingInterval);
      clearInterval(textInterval);
    };
  }, [pathId, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.title}>Construindo sua Trilha</Text>
      <Text style={styles.subtitle}>
        Nossa IA está desenhando o caminho ideal entre seu perfil atual e seu
        objetivo.
      </Text>

      <View style={styles.stepContainer}>
        <Text style={styles.stepText}>{statusText}</Text>
      </View>
    </View>
  );
}
