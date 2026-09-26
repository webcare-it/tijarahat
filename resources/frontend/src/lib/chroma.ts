import chroma from "chroma-js";

const hexToOklchChroma = (hexColor: string): string => {
  try {
    const color = chroma(hexColor);
    const oklch = color.oklch();
    const hue = isNaN(oklch[2]) || !isFinite(oklch[2]) ? 0 : oklch[2];
    return `oklch(${oklch[0].toFixed(3)} ${oklch[1].toFixed(3)} ${hue.toFixed(
      1
    )})`;
  } catch {
    return hexColor;
  }
};

export const getOklchValues = (
  hexColor: string
): { l: number; c: number; h: number } | null => {
  try {
    const color = chroma(hexColor);
    const oklch = color.oklch();
    return {
      l: oklch[0],
      c: oklch[1],
      h: oklch[2],
    };
  } catch {
    return null;
  }
};

export const updatePrimaryColor = (hexColor: string) => {
  if (typeof window === "undefined") return;

  const oklchColor = hexToOklchChroma(hexColor);

  const root = document.documentElement;
  root.style.setProperty("--primary", oklchColor);
  root.style.setProperty("--ring", oklchColor);
  root.style.setProperty("--sidebar-primary", oklchColor);
  root.style.setProperty("--sidebar-ring", oklchColor);
};

export const updatePrimaryForeground = (hexColor: string) => {
  if (typeof window === "undefined") return;

  const root = document.documentElement;

  const oklchColor = hexToOklchChroma(hexColor);
  root.style.setProperty("--primary-foreground", oklchColor);
};
