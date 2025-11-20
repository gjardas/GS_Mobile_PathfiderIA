import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useAlert } from "../../context/AlertContext"; // Importa o Hook de Alerta Customizado
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
      paddingTop: 60,
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      flexDirection: "row",
      alignItems: "center",
    },
    backButton: {
      marginRight: theme.spacing.m,
      padding: 5,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.foreground,
    },
    content: {
      padding: theme.spacing.l,
    },
    sectionLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.foreground,
      marginTop: theme.spacing.m,
      marginBottom: theme.spacing.s,
    },
    input: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.spacing.s,
      padding: 12,
      fontSize: 16,
      color: theme.colors.foreground,
    },
    readOnlyInput: {
      backgroundColor: theme.colors.muted,
      color: theme.colors.mutedForeground,
      borderColor: theme.colors.border,
    },
    skillsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: theme.spacing.s,
    },
    skillBadge: {
      backgroundColor: theme.colors.secondary,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 16,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    skillText: {
      color: theme.colors.secondaryForeground,
      marginRight: 6,
      fontSize: 14,
      fontWeight: "500",
    },
    removeSkillButton: {
      padding: 2,
    },
    addSkillRow: {
      flexDirection: "row",
      gap: 8,
      marginTop: theme.spacing.s,
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      width: 48,
      borderRadius: theme.spacing.s,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 16,
      borderRadius: theme.spacing.s,
      alignItems: "center",
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.xl,
    },
    saveButtonText: {
      color: theme.colors.primaryForeground,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

export default function ProfileScreen({ navigation }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { user } = useAuth();
  const { showAlert } = useAlert(); // Usa o Hook do Alerta

  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem("@App:profile");
      if (storedProfile) {
        const data = JSON.parse(storedProfile);
        setName(data.name || user?.name || "");
        setJobTitle(data.jobTitle || "");
        setSkills(data.skills || []);
      } else {
        setName(user?.name || "");
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    }
  };

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const profileData = {
        name,
        jobTitle,
        skills,
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem("@App:profile", JSON.stringify(profileData));

      // Simula um delay de rede para feedback visual
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Exibe o alerta customizado bonito
      showAlert("Sucesso", "Seu perfil foi atualizado e salvo com segurança!", {
        text: "Ótimo",
      });
    } catch (error) {
      showAlert("Erro", "Não foi possível salvar as alterações.", {
        style: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
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
        <Text style={styles.headerTitle}>Editar Perfil</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionLabel}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Seu nome"
          placeholderTextColor={theme.colors.mutedForeground}
        />

        <Text style={styles.sectionLabel}>Email</Text>
        <TextInput
          style={[styles.input, styles.readOnlyInput]}
          value={user?.email || "usuario@email.com"}
          editable={false}
        />

        <Text style={styles.sectionLabel}>Cargo Atual (Ponto A)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Desenvolvedor Júnior"
          placeholderTextColor={theme.colors.mutedForeground}
          value={jobTitle}
          onChangeText={setJobTitle}
        />

        <Text style={styles.sectionLabel}>Minhas Habilidades</Text>

        <View style={styles.skillsContainer}>
          {skills.map((skill, index) => (
            <View key={index} style={styles.skillBadge}>
              <Text style={styles.skillText}>{skill}</Text>
              <TouchableOpacity
                onPress={() => handleRemoveSkill(skill)}
                style={styles.removeSkillButton}
              >
                <Svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={theme.colors.destructive}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Path d="M18 6 6 18" />
                  <Path d="m6 6 12 12" />
                </Svg>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.addSkillRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Nova habilidade..."
            placeholderTextColor={theme.colors.mutedForeground}
            value={newSkill}
            onChangeText={setNewSkill}
            onSubmitEditing={handleAddSkill}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddSkill}>
            <Svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={theme.colors.primaryForeground}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="M5 12h14" />
              <Path d="M12 5v14" />
            </Svg>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.primaryForeground} />
          ) : (
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
