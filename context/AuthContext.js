import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/apiService";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedUser = await AsyncStorage.getItem("@App:user");
        const storedToken = await AsyncStorage.getItem("@App:token");

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;
        }
      } catch (error) {
        console.log("Erro ao carregar storage", error);
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  // --- LOGIN ---
  async function signIn(email, password) {
    try {
      // CORREÇÃO: Forçar email minúsculo
      const normalizedEmail = email.toLowerCase().trim();

      const response = await api.post("/auth/login", {
        email: normalizedEmail,
        senha: password,
      });

      const { token } = response.data;

      const userData = {
        email: normalizedEmail,
        name: "Usuário",
        token: token,
      };

      setUser(userData);

      await AsyncStorage.setItem("@App:token", token);
      await AsyncStorage.setItem("@App:user", JSON.stringify(userData));

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (error) {
      console.error("Erro Login:", error.response?.data || error.message);
      throw new Error("Email ou senha incorretos.");
    }
  }

  // --- REGISTRO ---
  async function signUp(name, email, password) {
    try {
      // CORREÇÃO: Forçar email minúsculo
      const normalizedEmail = email.toLowerCase().trim();

      await api.post("/auth/register", {
        nome: name,
        email: normalizedEmail,
        senha: password,
      });
    } catch (error) {
      console.error("Erro Registro:", error.response?.data);

      if (error.response?.data?.senha) {
        throw new Error(error.response.data.senha);
      }
      throw new Error("Não foi possível criar a conta. Verifique os dados.");
    }
  }

  async function signOut() {
    await AsyncStorage.clear();
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
