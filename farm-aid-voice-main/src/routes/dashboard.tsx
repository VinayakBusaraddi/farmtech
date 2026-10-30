import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { TrendingUp, TrendingDown, MapPin, ArrowRight } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { CROPS, avg, highest, lowest, trendDelta, type Crop } from "@/lib/crops";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Live Mandi Prices | KisanMarket" },
      { name: "description", content: "Live crop prices across Indian mandis with 7-day trends and selling advice." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { t, lang } = useI18n();
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>(CROPS[0].id);

  useEffect(() => {
    if (ready && !user) navigate({ to: "/login" });
  }, [ready, user, navigate]);

  const crop = useMemo(() => CROPS.find((c) => c.id === selected) ?? CROPS[0], [selected]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <div>
          <p className="text-sm text-muted-foreground">
            {t("welcome")}, +91 {user.phone}
          </p>
          <h1 className="text-2xl font-bold md:text-3xl">{t("livePrices")}</h1>
        </div>

        {/* Crop tiles */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {CROPS.map((c) => (
            <CropTile
              key={c.id}
              crop={c}
              active={selected === c.id}
              onClick={() => setSelected(c.id)}
              lang={lang}
            />
          ))}
        </div>

        {/* Detail */}
        <CropDetail crop={crop} />
      </main>
    </div>
  );
}

function CropTile({
  crop,
  active,
  onClick,
  lang,
}: {
  crop: Crop;
  active: boolean;
  onClick: () => void;
  lang: "en" | "hi";
}) {
  const a = avg(crop);
  const delta = trendDelta(crop);
  const up = delta >= 0;
  return (
    <button
      onClick={onClick}
      className={`group rounded-2xl border p-4 text-left transition-all hover:shadow-[var(--shadow-soft)] ${
        active
          ? "border-primary bg-primary/5 shadow-[var(--shadow-soft)]"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{crop.emoji}</span>
        <Badge
          variant="outline"
          className={`gap-1 ${up ? "border-success/40 text-success" : "border-destructive/40 text-destructive"}`}
        >
          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {delta.toFixed(1)}%
        </Badge>
      </div>
      <div className="mt-2 font-semibold">{lang === "hi" ? crop.nameHi : crop.nameEn}</div>
      <div className="text-lg font-bold text-foreground">₹{a.toLocaleString("en-IN")}</div>
      <div className="text-xs text-muted-foreground">{crop.unit}</div>
    </button>
  );
}

function CropDetail({ crop }: { crop: Crop }) {
  const { t, lang } = useI18n();
  const a = avg(crop);
  const hi = highest(crop);
  const lo = lowest(crop);
  const delta = trendDelta(crop);
  const advice = delta > 1.5 ? "sellNow" : "waitToSell";
  const trendData = crop.trend.map((p, i) => ({ day: `D${i + 1}`, price: p }));
  const marketData = crop.markets.map((m) => ({ name: `${m.name}, ${m.state}`, price: m.price }));

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {/* Trend */}
      <Card className="p-5 lg:col-span-2" style={{ background: "var(--gradient-card)" }}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm text-muted-foreground">{t("priceTrend")}</div>
            <h2 className="text-xl font-bold">
              {crop.emoji} {lang === "hi" ? crop.nameHi : crop.nameEn}
            </h2>
          </div>
          <Badge
            className={`px-3 py-1.5 text-sm ${
              advice === "sellNow"
                ? "bg-success text-success-foreground"
                : "bg-warning text-warning-foreground"
            }`}
          >
            {t(advice)}
          </Badge>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ left: 0, right: 8, top: 5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                }}
                formatter={(v: number) => [`₹${v}`, "Price"]}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="var(--primary)"
                strokeWidth={3}
                dot={{ fill: "var(--primary)", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Stats */}
      <div className="space-y-4">
        <Card className="p-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{t("avgPrice")}</div>
          <div className="text-2xl font-bold">₹{a.toLocaleString("en-IN")}</div>
          <div className="text-xs text-muted-foreground">{crop.unit}</div>
        </Card>
        <Card className="p-4 border-success/30">
          <div className="text-xs uppercase tracking-wide text-success">{t("highest")}</div>
          <div className="text-xl font-bold">₹{hi.price.toLocaleString("en-IN")}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {hi.name}, {hi.state}
          </div>
        </Card>
        <Card className="p-4 border-destructive/20">
          <div className="text-xs uppercase tracking-wide text-destructive">{t("lowest")}</div>
          <div className="text-xl font-bold">₹{lo.price.toLocaleString("en-IN")}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {lo.name}, {lo.state}
          </div>
        </Card>
      </div>

      {/* Market comparison */}
      <Card className="p-5 lg:col-span-3">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">{t("marketCompare")}</h3>
          <Link to="/chatbot" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Ask AI <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={marketData} margin={{ left: 0, right: 8, top: 5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }}
                formatter={(v: number) => [`₹${v}`, "Price"]}
              />
              <Bar dataKey="price" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
