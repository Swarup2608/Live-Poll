"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ThemeKey =
  | "light"
  | "dark"
  | "midnight"
  | "professional"
  | "disco"
  | "shootout"
  | "sea"
  | "grayscale"
  | "sunset"
  | "forest";

export const THEMES: {
  key: ThemeKey;
  label: string;
  grad1: string;
  grad2: string;
}[] = [
  { key: "light", label: "Light", grad1: "#555de3", grad2: "#b24dc8" },
  { key: "dark", label: "Dark", grad1: "#555de3", grad2: "#b24dc8" },
  { key: "midnight", label: "Midnight", grad1: "#0089d0", grad2: "#7d7ff3" },
  {
    key: "professional",
    label: "Professional",
    grad1: "#334a62",
    grad2: "#45697a",
  },
  { key: "disco", label: "Disco", grad1: "#f25dea", grad2: "#e9ae00" },
  { key: "shootout", label: "Shootout", grad1: "#df202e", grad2: "#8d0000" },
  { key: "sea", label: "Sea", grad1: "#0097a1", grad2: "#24a684" },
  {
    key: "grayscale",
    label: "Grayscale",
    grad1: "#484848",
    grad2: "#808080",
  },
  { key: "sunset", label: "Sunset", grad1: "#f9601f", grad2: "#df539f" },
  { key: "forest", label: "Forest", grad1: "#1e7729", grad2: "#827200" },
];

export const LOGO_BY_THEME: Record<ThemeKey, string> = {
  light: "/logo/logo.png",
  dark: "/logo/logo.png",
  midnight: "/logo/midnight.png",
  professional: "/logo/professional.png",
  disco: "/logo/disco.png",
  shootout: "/logo/shootout.png",
  sea: "/logo/sea.png",
  grayscale: "/logo/grayscale.png",
  sunset: "/logo/sunset.png",
  forest: "/logo/forest.png",
};

export const THEME_SWATCH_CLASS: Record<ThemeKey, string> = {
  light: "bg-[linear-gradient(135deg,#555de3,#b24dc8)]",
  dark: "bg-[linear-gradient(135deg,#555de3,#b24dc8)]",
  midnight: "bg-[linear-gradient(135deg,#0089d0,#7d7ff3)]",
  professional: "bg-[linear-gradient(135deg,#334a62,#45697a)]",
  disco: "bg-[linear-gradient(135deg,#f25dea,#e9ae00)]",
  shootout: "bg-[linear-gradient(135deg,#df202e,#8d0000)]",
  sea: "bg-[linear-gradient(135deg,#0097a1,#24a684)]",
  grayscale: "bg-[linear-gradient(135deg,#484848,#808080)]",
  sunset: "bg-[linear-gradient(135deg,#f9601f,#df539f)]",
  forest: "bg-[linear-gradient(135deg,#1e7729,#827200)]",
};

type ThemeContextValue = {
  theme: ThemeKey;
  setTheme: (t: ThemeKey) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeKey>("light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
