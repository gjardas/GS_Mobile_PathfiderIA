import { Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function DashboardScreen() {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: theme.colors.text, fontSize: 20 }}>
        Dashboard (Área Logada)
      </Text>
    </View>
  );
}
