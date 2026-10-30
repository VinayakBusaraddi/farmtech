import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "hi";

const dict = {
  en: {
    appName: "KisanMarket",
    tagline: "Real-time mandi prices & smart selling decisions",
    login: "Login",
    logout: "Logout",
    phoneNumber: "Phone number",
    enterPhone: "Enter your 10-digit phone number",
    sendOtp: "Send OTP",
    enterOtp: "Enter the 6-digit OTP",
    verifyOtp: "Verify OTP",
    otpSent: "OTP sent (use 123456 for demo)",
    invalidOtp: "Invalid OTP. Try 123456.",
    consent: "I agree to receive WhatsApp updates about prices, schemes & alerts.",
    dashboard: "Dashboard",
    chatbot: "AI Assistant",
    helpline: "Helpline",
    livePrices: "Live Crop Prices",
    marketCompare: "Market Comparison",
    priceTrend: "Price Trend (last 7 days)",
    sellNow: "Good time to sell",
    waitToSell: "Wait — prices may rise",
    pricePerQuintal: "₹/quintal",
    today: "Today",
    yesterday: "Yesterday",
    change: "Change",
    selectCrop: "Select a crop",
    askAnything: "Ask anything about farming, prices or schemes",
    speak: "Tap mic to speak",
    listening: "Listening...",
    typing: "Thinking...",
    welcome: "Welcome",
    govHelplines: "Government Helplines",
    helplineDesc: "Free numbers for farmers across India",
    whatsappEnabled: "WhatsApp updates enabled",
    bestMarket: "Best price today",
    avgPrice: "Average",
    highest: "Highest",
    lowest: "Lowest",
    send: "Send",
    chatGreeting: "Namaste! I am your farming assistant. Ask me about crop prices, weather, schemes or market advice.",
    heroCta: "Get Started",
    heroSub: "Login with your phone, see live mandi rates, get AI advice, and never sell at the wrong time again.",
    feature1Title: "Live Mandi Prices",
    feature1Desc: "Compare prices across markets in real time.",
    feature2Title: "Voice AI Assistant",
    feature2Desc: "Ask in your language. Get instant answers.",
    feature3Title: "Smart Alerts",
    feature3Desc: "WhatsApp updates for schemes & price spikes.",
  },
  hi: {
    appName: "किसानमार्केट",
    tagline: "रियल-टाइम मंडी भाव और स्मार्ट बिक्री निर्णय",
    login: "लॉगिन",
    logout: "लॉगआउट",
    phoneNumber: "मोबाइल नंबर",
    enterPhone: "अपना 10 अंकों का मोबाइल नंबर दर्ज करें",
    sendOtp: "OTP भेजें",
    enterOtp: "6 अंकों का OTP दर्ज करें",
    verifyOtp: "OTP सत्यापित करें",
    otpSent: "OTP भेजा गया (डेमो के लिए 123456 का उपयोग करें)",
    invalidOtp: "गलत OTP। 123456 आज़माएँ।",
    consent: "मैं भाव, योजनाओं और अलर्ट के लिए WhatsApp संदेश प्राप्त करने के लिए सहमत हूँ।",
    dashboard: "डैशबोर्ड",
    chatbot: "AI सहायक",
    helpline: "हेल्पलाइन",
    livePrices: "लाइव फसल भाव",
    marketCompare: "मंडी तुलना",
    priceTrend: "भाव का रुझान (पिछले 7 दिन)",
    sellNow: "बेचने का सही समय",
    waitToSell: "रुकें — भाव बढ़ सकता है",
    pricePerQuintal: "₹/क्विंटल",
    today: "आज",
    yesterday: "कल",
    change: "बदलाव",
    selectCrop: "फसल चुनें",
    askAnything: "खेती, भाव या योजना के बारे में कुछ भी पूछें",
    speak: "बोलने के लिए माइक दबाएँ",
    listening: "सुन रहा हूँ...",
    typing: "सोच रहा हूँ...",
    welcome: "नमस्ते",
    govHelplines: "सरकारी हेल्पलाइन",
    helplineDesc: "पूरे भारत के किसानों के लिए मुफ़्त नंबर",
    whatsappEnabled: "WhatsApp अपडेट चालू",
    bestMarket: "आज का सर्वोत्तम भाव",
    avgPrice: "औसत",
    highest: "अधिकतम",
    lowest: "न्यूनतम",
    send: "भेजें",
    chatGreeting: "नमस्ते! मैं आपका कृषि सहायक हूँ। फसल भाव, मौसम, योजना या मंडी सलाह के बारे में पूछें।",
    heroCta: "शुरू करें",
    heroSub: "अपने फोन से लॉगिन करें, लाइव मंडी भाव देखें, AI सलाह पाएँ, और कभी गलत समय पर न बेचें।",
    feature1Title: "लाइव मंडी भाव",
    feature1Desc: "रियल-टाइम में मंडियों के भाव की तुलना करें।",
    feature2Title: "वॉइस AI सहायक",
    feature2Desc: "अपनी भाषा में पूछें। तुरंत जवाब पाएँ।",
    feature3Title: "स्मार्ट अलर्ट",
    feature3Desc: "योजनाओं और भाव में बढ़ोतरी के लिए WhatsApp अपडेट।",
  },
} as const;

export type TKey = keyof typeof dict.en;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: TKey) => string };

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("km_lang") as Lang | null;
      if (saved === "en" || saved === "hi") setLangState(saved);
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("km_lang", l);
  };

  const t = (k: TKey) => dict[lang][k] ?? dict.en[k];
  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
