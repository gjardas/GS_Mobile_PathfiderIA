import { Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function WelcomeScreen() {
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
        Tela de Login (Welcome)
      </Text>
    </View>
  );
}
