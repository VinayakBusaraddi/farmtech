import { createFileRoute } from "@tanstack/react-router";
import { Phone, MessageCircle, Tractor, CloudRain, Landmark, ShieldAlert, Sprout } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/helpline")({
  head: () => ({
    meta: [
      { title: "Government Helplines for Farmers | KisanMarket" },
      { name: "description", content: "Toll-free government helpline numbers for Indian farmers — Kisan Call Centre, PM-KISAN, weather, insurance and more." },
    ],
  }),
  component: HelplinePage,
});

const HELPLINES = [
  {
    icon: Tractor,
    name: "Kisan Call Centre",
    desc: "Free farming advice in 22 languages",
    number: "1800-180-1551",
  },
  { icon: Landmark, name: "PM-KISAN Helpline", desc: "₹6,000/year scheme support", number: "155261" },
  {
    icon: ShieldAlert,
    name: "PM Fasal Bima Yojana",
    desc: "Crop insurance claims & queries",
    number: "1800-180-1551",
  },
  { icon: Sprout, name: "Soil Health Card", desc: "Free soil testing helpline", number: "011-24305591" },
  { icon: CloudRain, name: "IMD Weather Helpline", desc: "Daily weather & forecast", number: "1800-180-1717" },
  {
    icon: MessageCircle,
    name: "eNAM Support",
    desc: "Online mandi platform helpdesk",
    number: "1800-270-0224",
  },
  { icon: Landmark, name: "Kisan Credit Card (KCC)", desc: "Loan & credit support", number: "1800-180-1551" },
  { icon: Phone, name: "Agriculture Ministry", desc: "Central toll-free", number: "1800-180-1551" },
];

function HelplinePage() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold md:text-3xl">{t("govHelplines")}</h1>
          <p className="mt-1 text-muted-foreground">{t("helplineDesc")}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HELPLINES.map((h) => (
            <Card
              key={h.name}
              className="flex flex-col p-5 transition-all hover:shadow-[var(--shadow-soft)]"
            >
              <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <h.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{h.name}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{h.desc}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="font-mono text-lg font-bold tracking-tight text-foreground">
                  {h.number}
                </span>
                <Button asChild size="sm" className="gap-1.5">
                  <a href={`tel:${h.number.replace(/[^0-9]/g, "")}`}>
                    <Phone className="h-4 w-4" /> Call
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
