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
import api from "../../api/ApiService"; // API Service
import { useAlert } from "../../context/AlertContext";
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
  const { showAlert } = useAlert();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    loadProfileFromApi();
  }, []);

  // 1. Carrega dados do Backend (Oracle)
  const loadProfileFromApi = async () => {
    try {
      setIsFetching(true);
      const response = await api.get("/api/v1/profile");
      const data = response.data;

      // Preenche os estados com os dados reais do banco
      setName(data.nome || "");
      setEmail(data.email || "");
      setJobTitle(data.cargoAtual || "");
      setSkills(data.skills || []);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      showAlert("Aviso", "Não foi possível carregar seus dados do servidor.", {
        style: "destructive",
      });
    } finally {
      setIsFetching(false);
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

  // 2. Salva dados no Backend
  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        nome: name,
        cargoAtual: jobTitle,
        skills: skills,
      };

      await api.put("/api/v1/profile", payload);

      showAlert("Sucesso", "Perfil sincronizado com o banco de dados!", {
        text: "OK",
      });
    } catch (error) {
      console.error(error);
      showAlert("Erro", "Falha ao salvar no servidor.", {
        style: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

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

        <Text style={styles.sectionLabel}>Email (Cadastro)</Text>
        <TextInput
          style={[styles.input, styles.readOnlyInput]}
          value={email}
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
