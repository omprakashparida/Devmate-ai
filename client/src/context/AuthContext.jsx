import {
    createContext,
    useContext,
    useState,
    useEffect,
  } from "react";
  
  const AuthContext = createContext();
  
  export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(
      localStorage.getItem("token")
    );
  
    const [user, setUser] = useState(null);
  
    const login = (userData, jwt) => {
      localStorage.setItem("token", jwt);
  
      setToken(jwt);
      setUser(userData);
    };
  
    const logout = () => {
      localStorage.removeItem("token");
  
      setToken(null);
      setUser(null);
    };
  
    useEffect(() => {
      const storedToken =
        localStorage.getItem("token");
  
      if (storedToken) {
        setToken(storedToken);
      }
    }, []);
  
    return (
      <AuthContext.Provider
        value={{
          token,
          user,
          login,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () =>
    useContext(AuthContext);