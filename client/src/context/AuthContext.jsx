import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import api from "../services/api";

const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {
  const [token, setToken] =
    useState(
      localStorage.getItem(
        "token"
      )
    );

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const login = (
    userData,
    jwt
  ) => {
    localStorage.setItem(
      "token",
      jwt
    );

    setToken(jwt);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const fetchUser =
      async () => {
        const storedToken =
          localStorage.getItem(
            "token"
          );

        if (!storedToken) {
          setLoading(false);
          return;
        }

        try {
          const response =
            await api.get(
              "/auth/me"
            );

          setUser(
            response.data
          );
        } catch (error) {
          console.error(
            error
          );

          localStorage.removeItem(
            "token"
          );

          setToken(null);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth =
  () => useContext(
    AuthContext
  );