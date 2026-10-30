import { Link, useNavigate } from "@tanstack/react-router";
import { Sprout, LogOut, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const { t, lang, setLang } = useI18n();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-foreground">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
            <Sprout className="h-5 w-5" />
          </span>
          <span className="text-lg">{t("appName")}</span>
        </Link>

        {user && (
          <nav className="hidden gap-1 md:flex">
            <Link
              to="/dashboard"
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              activeProps={{ className: "rounded-lg px-3 py-2 text-sm font-medium bg-muted text-foreground" }}
            >
              {t("dashboard")}
            </Link>
            <Link
              to="/chatbot"
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              activeProps={{ className: "rounded-lg px-3 py-2 text-sm font-medium bg-muted text-foreground" }}
            >
              {t("chatbot")}
            </Link>
            <Link
              to="/helpline"
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              activeProps={{ className: "rounded-lg px-3 py-2 text-sm font-medium bg-muted text-foreground" }}
            >
              {t("helpline")}
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="gap-1.5"
          >
            <Globe className="h-4 w-4" />
            {lang === "en" ? "हिंदी" : "English"}
          </Button>
          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                navigate({ to: "/" });
              }}
              className="gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t("logout")}</span>
            </Button>
          )}
        </div>
      </div>

      {user && (
        <nav className="flex gap-1 overflow-x-auto border-t border-border/60 px-4 py-1.5 md:hidden">
          {(["dashboard", "chatbot", "helpline"] as const).map((p) => (
            <Link
              key={p}
              to={`/${p}`}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground"
              activeProps={{ className: "rounded-lg px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground" }}
            >
              {t(p)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
