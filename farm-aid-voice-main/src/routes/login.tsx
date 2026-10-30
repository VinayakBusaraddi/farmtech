import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { LoginForm } from "./index";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — KisanMarket" },
      { name: "description", content: "Login with your phone number to access live mandi prices and AI farming advice." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <LoginForm />
      </main>
    </div>
  );
}
