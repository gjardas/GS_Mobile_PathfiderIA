import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import api from "../../api/ApiService";
import { useAlert } from "../../context/AlertContext";
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
  const { showAlert } = useAlert();
  const { pathId } = route.params || {};

  const pollingRef = useRef(null);
  const textIntervalRef = useRef(null);

  const [statusText, setStatusText] = useState("Inicializando...");

  useEffect(() => {
    console.log("PROCESSAMENTO: Iniciando para ID:", pathId);

    const steps = [
      "Analisando seu perfil atual...",
      "Mapeando gaps de competência...",
      "Consultando tendências de mercado...",
      "Estruturando plano de aprendizado...",
      "Finalizando detalhes...",
    ];

    let stepIndex = 0;
    textIntervalRef.current = setInterval(() => {
      setStatusText(steps[stepIndex]);
      stepIndex = (stepIndex + 1) % steps.length;
    }, 2500);

    const finishProcess = (data) => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (textIntervalRef.current) clearInterval(textIntervalRef.current);
      navigation.replace("LearningPath", { pathData: data });
    };

    const handleFailure = (message) => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (textIntervalRef.current) clearInterval(textIntervalRef.current);

      showAlert("Erro", message, {
        style: "destructive",
        onPress: () => navigation.navigate("Dashboard"),
      });
    };

    const checkStatus = async () => {
      try {
        const response = await api.get(
          "/api/v1/learning-paths?page=0&size=5&sort=id,desc"
        );
        const list = response.data?.content || response.data || [];

        const targetTrilha = list.find((item) => {
          const itemId = item.idTrilha || item.id;
          return String(itemId) === String(pathId);
        });

        if (targetTrilha) {
          if (
            targetTrilha.status === "CONCLUIDA" ||
            (targetTrilha.dadosJsonIA &&
              String(targetTrilha.dadosJsonIA).length > 20)
          ) {
            finishProcess(targetTrilha);
          } else if (targetTrilha.status === "ERRO") {
            handleFailure(
              "Houve um erro no processamento da IA. Tente novamente."
            );
          }
        }
      } catch (error) {
        console.log("Erro no polling:", error.message);
      }
    };

    checkStatus();
    pollingRef.current = setInterval(checkStatus, 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (textIntervalRef.current) clearInterval(textIntervalRef.current);
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
