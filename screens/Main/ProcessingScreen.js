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
  const { pathId, isDemo } = route.params || {};

  const [statusText, setStatusText] = useState("Inicializando...");

  // Dados Mockados de Segurança (Caso o Backend falhe ou seja demo)
  const MOCK_SUCCESS_DATA = {
    tituloObjetivo: "Especialista Cloud (Demo)",
    dadosJsonIA: {
      steps: [
        {
          title: "Fundamentos de Cloud",
          description: "Conceitos básicos de AWS e Azure.",
          type: "Curso",
        },
        {
          title: "Certificação AWS Practitioner",
          description: "Preparação e exame oficial.",
          type: "Certificação",
        },
        {
          title: "Docker e Kubernetes",
          description: "Orquestração de containers avançada.",
          type: "Projeto Prático",
        },
        {
          title: "Terraform",
          description: "Infraestrutura como código (IaC).",
          type: "Curso",
        },
      ],
    },
  };

  useEffect(() => {
    console.log("CONSOLE LOG: Iniciando processamento para ID:", pathId);

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
    }, 2000);

    let pollingInterval;

    const finishProcess = (data) => {
      clearInterval(pollingInterval);
      clearInterval(textInterval);
      navigation.replace("LearningPath", { pathData: data });
    };

    // Lógica Principal de Decisão
    if (isDemo || (typeof pathId === "string" && pathId.startsWith("DEMO"))) {
      console.log("CONSOLE LOG: Modo Demo ativado. Simulando espera...");
      setTimeout(() => finishProcess(MOCK_SUCCESS_DATA), 5000);
    } else {
      // 2. MODO REAL: Faz Polling no Backend Java
      const checkStatus = async () => {
        try {
          console.log("CONSOLE LOG: Polling backend...");
          const response = await api.get(`/api/v1/learning-paths/${pathId}`);
          const data = response.data;
          console.log("CONSOLE LOG: Status recebido:", data?.status);

          if (
            data.status === "CONCLUIDA" ||
            (data.dadosJsonIA && String(data.dadosJsonIA).length > 10)
          ) {
            finishProcess(data);
          }
        } catch (error) {
          console.log(
            "CONSOLE LOG: Aguardando backend... (Tentando novamente em 3s)"
          );
        }
      };

      pollingInterval = setInterval(checkStatus, 3000);

      // Timeout de segurança AUMENTADO (30s)
      // Se o Java não responder nesse tempo, finaliza com Mock.
      setTimeout(() => {
        console.log(
          "CONSOLE LOG: Timeout do Java (30s). Ativando fallback de segurança."
        );
        finishProcess(MOCK_SUCCESS_DATA);
      }, 30000); // Aumentado de 15000 para 30000 ms
    }

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
