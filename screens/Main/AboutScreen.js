import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
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
      backgroundColor: theme.colors.background,
      flexDirection: "row",
      alignItems: "center",
    },
    content: {
      padding: theme.spacing.l,
      alignItems: "center",
    },
    logoBox: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.m,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    logoText: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.primaryForeground,
    },
    appName: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.foreground,
      marginBottom: 4,
    },
    version: {
      fontSize: 14,
      color: theme.colors.mutedForeground,
      marginBottom: theme.spacing.xl,
    },
    card: {
      width: "100%",
      backgroundColor: theme.colors.card,
      borderRadius: theme.spacing.m,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.l,
      marginBottom: theme.spacing.m,
    },
    label: {
      fontSize: 12,
      fontWeight: "bold",
      color: theme.colors.mutedForeground,
      textTransform: "uppercase",
      marginBottom: 4,
    },
    value: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.foreground,
      marginBottom: theme.spacing.m,
    },
    mono: {
      fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
      backgroundColor: theme.colors.muted,
      padding: 4,
      borderRadius: 4,
      fontSize: 14,
    },
    member: {
      fontSize: 16,
      color: theme.colors.foreground,
      marginBottom: 8,
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.muted,
    },
  });

export default function AboutScreen({ navigation }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: 10 }}
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
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>P</Text>
        </View>

        <Text style={styles.appName}>Pathfinder AI</Text>
        <Text style={styles.version}>Versão 1.0.0 (Global Solution)</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Hash do Commit</Text>
          <Text style={[styles.value, styles.mono]}>
            c1a0dc16fcbce2ccf20a4dae49d9807fb5d0a298
          </Text>

          <Text style={styles.label}>Disciplina</Text>
          <Text style={styles.value}>Mobile Application Development</Text>
        </View>

        <View style={styles.card}>
          <Text style={[styles.label, { marginBottom: 12 }]}>
            Desenvolvido por
          </Text>

          <Text style={styles.member}>Guilherme Jardim - RM556814</Text>
          <Text style={styles.member}>Fernando Fontes - RM555317</Text>
        </View>
      </ScrollView>
    </View>
  );
}
