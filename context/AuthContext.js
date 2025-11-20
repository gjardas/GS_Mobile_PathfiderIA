import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Verifica se existe usuário salvo ao abrir o app
  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedUser = await AsyncStorage.getItem("@App:user");
        const storedToken = await AsyncStorage.getItem("@App:token");

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.log("Erro ao carregar storage", error);
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  // 2. Função de Login (Simulação)
  async function signIn(email, password, name) {
    // AQUI ENTRARIA O AXIOS (api.post)
    // Por enquanto, vamos simular para você conseguir testar o fluxo

    const mockUser = {
      name: name || "Usuário Teste",
      email: email,
      token: "token-falso-jwt-123",
    };

    setUser(mockUser); // Atualiza o estado e o AppNavigator troca de tela sozinho

    // Salva no celular para persistir o login
    await AsyncStorage.setItem("@App:user", JSON.stringify(mockUser));
    await AsyncStorage.setItem("@App:token", mockUser.token);
  }

  // 3. Função de Logout
  async function signOut() {
    await AsyncStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, loading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para facilitar o import
export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
