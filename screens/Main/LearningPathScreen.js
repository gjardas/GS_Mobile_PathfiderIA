import AsyncStorage from "@react-native-async-storage/async-storage"; // Import para salvar no perfil
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Polyline } from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
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
    content: {
      padding: theme.spacing.l,
    },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.spacing.m,
      padding: theme.spacing.m,
      marginBottom: theme.spacing.m,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: "row",
      gap: 12,
      alignItems: "center", // Alinha ícone de check com o texto
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    // Estilo para quando o card está concluído
    cardCompleted: {
      backgroundColor: theme.colors.muted, // Fica cinzinha
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
    stepContent: {
      flex: 1,
    },
    stepTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.foreground,
      marginBottom: 4,
    },
    stepTitleCompleted: {
      textDecorationLine: "line-through", // Risca o texto
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
    homeButtonText: {
      color: theme.colors.foreground,
      fontWeight: "600",
    },
  });

export default function LearningPathScreen({ navigation, route }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { pathData } = route.params || {};

  // Estado para controlar quais passos foram marcados (Set de índices)
  const [completedSteps, setCompletedSteps] = useState(new Set());

  // Parseia os dados (mesma lógica de antes)
  let steps = [];
  try {
    if (pathData?.dadosJsonIA) {
      let rawData = pathData.dadosJsonIA;
      if (typeof rawData === "string") {
        rawData = rawData
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        try {
          rawData = JSON.parse(rawData);
        } catch (e) {}
      }
      if (Array.isArray(rawData)) {
        steps = rawData;
      } else if (typeof rawData === "object") {
        steps = rawData.steps || rawData.trilha || rawData.passos || [];
      }
    }
  } catch (e) {
    console.error(e);
  }

  // --- LÓGICA NOVA: Adicionar Habilidade ao Perfil ---
  const handleCheckStep = async (stepTitle, index) => {
    // 1. Atualiza visual (Check/Uncheck)
    const newCompleted = new Set(completedSteps);
    const isChecking = !newCompleted.has(index); // Se não tem, está marcando agora

    if (isChecking) {
      newCompleted.add(index);
    } else {
      newCompleted.delete(index);
    }
    setCompletedSteps(newCompleted);

    // 2. Se estiver marcando (Checked), adiciona ao perfil
    if (isChecking && stepTitle) {
      try {
        const storedProfile = await AsyncStorage.getItem("@App:profile");
        let profile = storedProfile
          ? JSON.parse(storedProfile)
          : { skills: [] };

        // Garante que skills é um array
        if (!profile.skills) profile.skills = [];

        // Verifica se já tem a habilidade para não duplicar
        if (!profile.skills.includes(stepTitle)) {
          profile.skills.push(stepTitle);

          // Salva de volta
          await AsyncStorage.setItem("@App:profile", JSON.stringify(profile));

          Alert.alert(
            "Parabéns! 🚀",
            `A habilidade "${stepTitle}" foi adicionada ao seu perfil.`
          );
        }
      } catch (error) {
        console.error("Erro ao salvar habilidade:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {pathData?.tituloObjetivo || "Sua Trilha"}
        </Text>
        <Text style={styles.headerSubtitle}>
          Toque no círculo para concluir e ganhar a skill!
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {steps && steps.length > 0 ? (
          steps.map((step, index) => {
            const isDone = completedSteps.has(index);
            const title =
              step.title || step.titulo || step.nome || "Passo sem título";

            return (
              <TouchableOpacity
                key={index}
                style={[styles.card, isDone && styles.cardCompleted]}
                onPress={() => handleCheckStep(title, index)}
                activeOpacity={0.7}
              >
                {/* CHECKBOX CUSTOMIZADO */}
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
            style={[styles.card, { justifyContent: "center", padding: 30 }]}
          >
            <Text
              style={{
                textAlign: "center",
                color: theme.colors.mutedForeground,
              }}
            >
              Nenhuma etapa encontrada.
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
