import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sprout, BarChart3, Mic, Bell, ArrowRight, Phone, ShieldCheck } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { t } = useI18n();
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && user) navigate({ to: "/dashboard" });
  }, [ready, user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <section className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sprout className="h-3.5 w-3.5" /> {t("tagline")}
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
              {t("appName")} —{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-hero)" }}
              >
                {t("tagline")}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">{t("heroSub")}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2 shadow-[var(--shadow-elevated)]">
                <Link to="/login">
                  {t("heroCta")} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/helpline">{t("helpline")}</Link>
              </Button>
            </div>
          </div>

          <Card
            className="overflow-hidden border-0 p-0 shadow-[var(--shadow-elevated)]"
            style={{ background: "var(--gradient-hero)" }}
          >
            <div className="space-y-4 p-8 text-primary-foreground">
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">Indore Mandi · {t("today")}</span>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">LIVE</span>
              </div>
              <div className="space-y-3">
                {[
                  { c: "🌾 Wheat", p: "₹2,494", d: "+1.2%" },
                  { c: "🧅 Onion", p: "₹1,962", d: "+2.2%" },
                  { c: "🍅 Tomato", p: "₹1,490", d: "−1.6%" },
                  { c: "🫘 Soybean", p: "₹4,520", d: "+0.2%" },
                ].map((r) => (
                  <div
                    key={r.c}
                    className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 backdrop-blur"
                  >
                    <span className="font-medium">{r.c}</span>
                    <div className="text-right">
                      <div className="font-bold">{r.p}</div>
                      <div className="text-xs opacity-80">{r.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        <section className="mt-20 grid gap-5 md:grid-cols-3">
          {[
            { icon: BarChart3, title: t("feature1Title"), desc: t("feature1Desc") },
            { icon: Mic, title: t("feature2Title"), desc: t("feature2Desc") },
            { icon: Bell, title: t("feature3Title"), desc: t("feature3Desc") },
          ].map((f) => (
            <Card key={f.title} className="p-6" style={{ background: "var(--gradient-card)" }}>
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}

// Login route lives at /login — see login.tsx
export function LoginForm() {
  const { t } = useI18n();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [whatsapp, setWhatsapp] = useState(true);

  const sendOtp = () => {
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    setStep("otp");
    toast.success(t("otpSent"));
  };
  const verify = () => {
    if (otp !== "123456") {
      toast.error(t("invalidOtp"));
      return;
    }
    login(phone, whatsapp);
    if (whatsapp) toast.success(t("whatsappEnabled"));
    navigate({ to: "/dashboard" });
  };

  return (
    <Card className="mx-auto mt-10 max-w-md p-6 shadow-[var(--shadow-elevated)]">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Phone className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold">{t("login")}</h2>
          <p className="text-sm text-muted-foreground">{t("enterPhone")}</p>
        </div>
      </div>

      {step === "phone" ? (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="phone">{t("phoneNumber")}</Label>
            <div className="flex">
              <span className="grid place-items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                +91
              </span>
              <Input
                id="phone"
                inputMode="numeric"
                maxLength={10}
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="rounded-l-none text-base"
              />
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-lg bg-secondary/50 p-3">
            <Checkbox id="wa" checked={whatsapp} onCheckedChange={(v) => setWhatsapp(!!v)} />
            <Label htmlFor="wa" className="cursor-pointer text-sm leading-snug">
              {t("consent")}
            </Label>
          </div>
          <Button onClick={sendOtp} className="w-full" size="lg">
            {t("sendOtp")}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="otp">{t("enterOtp")}</Label>
            <Input
              id="otp"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="text-center text-2xl tracking-[0.5em]"
            />
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" /> Demo OTP: <b>123456</b>
            </p>
          </div>
          <Button onClick={verify} className="w-full" size="lg">
            {t("verifyOtp")}
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => setStep("phone")}>
            ← Change number
          </Button>
        </div>
      )}
    </Card>
  );
}
