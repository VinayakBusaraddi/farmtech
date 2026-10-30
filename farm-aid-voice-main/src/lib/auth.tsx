import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type User = { phone: string; whatsapp: boolean; createdAt: number };

type AuthCtx = {
  user: User | null;
  login: (phone: string, whatsapp: boolean) => void;
  logout: () => void;
  ready: boolean;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("km_user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        /* ignore */
      }
    }
    setReady(true);
  }, []);

  const login = (phone: string, whatsapp: boolean) => {
    const u: User = { phone, whatsapp, createdAt: Date.now() };
    setUser(u);
    localStorage.setItem("km_user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("km_user");
  };

  return <Ctx.Provider value={{ user, login, logout, ready }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be inside AuthProvider");
  return c;
}
