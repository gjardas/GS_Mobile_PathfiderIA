import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Polyline } from "react-native-svg";
import { useAlert } from "../../context/AlertContext";
import { useTheme } from "../../context/ThemeContext";

const createStyles = (theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
      padding: theme.spacing.l,
      paddingTop: 60,
      backgroundColor: theme.colors.primary,
      borderBottomLeftRadius: theme.spacing.m,
      borderBottomRightRadius: theme.spacing.m,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.colors.primaryForeground,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      color: theme.colors.primaryForeground,
      opacity: 0.8,
    },
    progressContainer: {
      marginTop: 16,
      height: 8,
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: 4,
      overflow: "hidden",
    },
    progressBar: {
      height: "100%",
      backgroundColor: theme.colors.success || "#10B981",
      borderRadius: 4,
    },
    progressText: {
      color: theme.colors.primaryForeground,
      fontSize: 12,
      marginTop: 4,
      textAlign: "right",
    },
    content: { padding: theme.spacing.l },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.spacing.m,
      padding: theme.spacing.m,
      marginBottom: theme.spacing.m,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: "row",
      gap: 12,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    cardCompleted: {
      backgroundColor: theme.colors.muted,
      borderColor: theme.colors.primary,
    },
    checkBox: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: theme.colors.mutedForeground,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
    },
    checkBoxSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    stepContent: { flex: 1 },
    stepTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.foreground,
      marginBottom: 4,
    },
    stepTitleCompleted: {
      textDecorationLine: "line-through",
      color: theme.colors.mutedForeground,
    },
    stepDesc: {
      fontSize: 14,
      color: theme.colors.mutedForeground,
      lineHeight: 20,
    },
    tag: {
      alignSelf: "flex-start",
      marginTop: 8,
      paddingHorizontal: 8,
      paddingVertical: 2,
      backgroundColor: theme.colors.muted,
      borderRadius: 4,
    },
    tagText: {
      fontSize: 10,
      fontWeight: "bold",
      color: theme.colors.mutedForeground,
      textTransform: "uppercase",
    },
    completionBanner: {
      backgroundColor: theme.colors.success || "#10B981",
      padding: theme.spacing.m,
      borderRadius: theme.spacing.m,
      marginBottom: theme.spacing.l,
      alignItems: "center",
    },
    completionText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
    homeButton: {
      marginTop: theme.spacing.m,
      marginBottom: theme.spacing.xl,
      padding: theme.spacing.m,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.spacing.s,
      alignItems: "center",
    },
    homeButtonText: { color: theme.colors.foreground, fontWeight: "600" },
  });

export default function LearningPathScreen({ navigation, route }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { showAlert } = useAlert();
  const { pathData } = route.params || {};

  const pathId = pathData?.idTrilha || pathData?.id || "demo-path-default";

  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    let parsedSteps = [];
    try {
      console.log("LearningPath - Dados Recebidos:", pathData);

      if (pathData?.dadosJsonIA) {
        let rawData = pathData.dadosJsonIA;
        if (typeof rawData === "string") {
          rawData = rawData
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
          try {
            rawData = JSON.parse(rawData);
          } catch (e) {
            console.log("Erro parse JSON", e);
          }
        }

        if (Array.isArray(rawData)) {
          parsedSteps = rawData;
        } else if (typeof rawData === "object") {
          parsedSteps =
            rawData.steps ||
            rawData.trilha ||
            rawData.passos ||
            rawData.path ||
            rawData.data ||
            [];
        }
      }
    } catch (e) {
      console.error(e);
    }

    console.log("Steps finais:", parsedSteps);
    setSteps(parsedSteps);
    loadProgress();
  }, [pathId]);

  const loadProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem(
        `@PathProgress:${pathId}`
      );
      if (savedProgress) {
        setCompletedSteps(new Set(JSON.parse(savedProgress)));
      }
    } catch (error) {
      console.log("Erro ao carregar progresso", error);
    }
  };

  const handleCheckStep = async (stepTitle, index) => {
    const newCompleted = new Set(completedSteps);
    const isChecking = !newCompleted.has(index);

    if (isChecking) {
      newCompleted.add(index);
    } else {
      newCompleted.delete(index);
    }
    setCompletedSteps(newCompleted);

    await AsyncStorage.setItem(
      `@PathProgress:${pathId}`,
      JSON.stringify([...newCompleted])
    );

    if (isChecking && stepTitle) {
      updateUserProfile(stepTitle);
    }

    if (isChecking && newCompleted.size === steps.length && steps.length > 0) {
      showAlert(
        "🎉 Trilha Concluída!",
        "Parabéns! Você completou todas as etapas desta jornada.",
        { text: "Incrível!" }
      );
    }
  };

  const updateUserProfile = async (skill) => {
    try {
      const storedProfile = await AsyncStorage.getItem("@App:profile");
      let profile = storedProfile ? JSON.parse(storedProfile) : { skills: [] };
      if (!profile.skills) profile.skills = [];

      if (!profile.skills.includes(skill)) {
        profile.skills.push(skill);
        await AsyncStorage.setItem("@App:profile", JSON.stringify(profile));
        showAlert(
          "Skill Desbloqueada! 🔓",
          `"${skill}" foi adicionada ao seu perfil.`
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const totalSteps = steps.length;
  const completedCount = completedSteps.size;
  const progressPercent =
    totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;
  const isFullyCompleted = totalSteps > 0 && completedCount === totalSteps;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {pathData?.tituloObjetivo || "Sua Trilha"}
        </Text>
        <Text style={styles.headerSubtitle}>
          {completedCount} de {totalSteps} etapas concluídas
        </Text>

        <View style={styles.progressContainer}>
          <View
            style={[styles.progressBar, { width: `${progressPercent}%` }]}
          />
        </View>
        <Text style={styles.progressText}>{Math.round(progressPercent)}%</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {isFullyCompleted && (
          <View style={styles.completionBanner}>
            <Text style={styles.completionText}>
              🏆 Trilha Finalizada com Sucesso!
            </Text>
          </View>
        )}

        {steps && steps.length > 0 ? (
          steps.map((step, index) => {
            const isDone = completedSteps.has(index);
            const title =
              step.title || step.titulo || step.nome || "Passo " + (index + 1);

            return (
              <TouchableOpacity
                key={index}
                style={[styles.card, isDone && styles.cardCompleted]}
                onPress={() => handleCheckStep(title, index)}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.checkBox, isDone && styles.checkBoxSelected]}
                >
                  {isDone && (
                    <Svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FFF"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <Polyline points="20 6 9 17 4 12" />
                    </Svg>
                  )}
                </View>

                <View style={styles.stepContent}>
                  <Text
                    style={[
                      styles.stepTitle,
                      isDone && styles.stepTitleCompleted,
                    ]}
                  >
                    {title}
                  </Text>
                  <Text style={styles.stepDesc}>
                    {step.description ||
                      step.descricao ||
                      step.conteudo ||
                      "Sem descrição."}
                  </Text>

                  {(step.type || step.tipo) && (
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>
                        {step.type || step.tipo}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View
            style={[
              styles.card,
              {
                justifyContent: "center",
                padding: 30,
                flexDirection: "column",
              },
            ]}
          >
            <Text
              style={{
                textAlign: "center",
                color: theme.colors.mutedForeground,
              }}
            >
              Nenhuma etapa encontrada.
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: theme.colors.border,
                marginTop: 10,
              }}
            >
              Dados: {JSON.stringify(pathData?.dadosJsonIA)}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Text style={styles.homeButtonText}>Voltar para o Início</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
