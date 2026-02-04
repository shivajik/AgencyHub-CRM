import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { User } from "@/lib/mockData";

type AuthContextType = {
  user: User | null;
  login: (email: string, role: "admin" | "manager" | "client") => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Simulate session check
    const storedUser = localStorage.getItem("agency_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, role: "admin" | "manager" | "client") => {
    const mockUser: User = {
      id: "1",
      name: role === "client" ? "Acme Corp Client" : "Alex Admin",
      email,
      role,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      company: role === "client" ? "Acme Corp" : "AgencyFlow"
    };
    
    setUser(mockUser);
    localStorage.setItem("agency_user", JSON.stringify(mockUser));
    
    if (role === "client") {
      setLocation("/portal");
    } else {
      setLocation("/admin");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("agency_user");
    setLocation("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}