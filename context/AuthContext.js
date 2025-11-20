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
          // Restaura o token no header do Axios
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

  // --- LOGIN (POST /auth/login) ---
  async function signIn(email, password) {
    try {
      // O Java espera: { "email": "...", "senha": "..." }
      const response = await api.post("/auth/login", {
        email: email,
        senha: password, // Mapeando 'password' do JS para 'senha' do Java
      });

      // O Java retorna: { "token": "eyJ..." }
      const { token } = response.data;

      // Criamos o objeto de usuário para uso interno do app
      const userData = {
        email: email,
        name: "Usuário", // O endpoint de login não retorna o nome, usamos placeholder
        token: token,
      };

      setUser(userData);

      // Persistência
      await AsyncStorage.setItem("@App:token", token);
      await AsyncStorage.setItem("@App:user", JSON.stringify(userData));

      // Atualiza o Axios para chamadas futuras
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (error) {
      console.error("Erro Login:", error.response?.data || error.message);
      throw new Error("Email ou senha incorretos.");
    }
  }

  // --- REGISTRO (POST /auth/register) ---
  async function signUp(name, email, password) {
    try {
      // O Java espera: { "nome": "...", "email": "...", "senha": "..." }
      await api.post("/auth/register", {
        nome: name,
        email: email,
        senha: password, // Mapeando 'password' para 'senha'
      });
      // Retorna sucesso (200 OK)
    } catch (error) {
      console.error("Erro Registro:", error.response?.data);
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
