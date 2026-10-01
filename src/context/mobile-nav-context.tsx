"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type MobileNavContextValue = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  openMenu: () => void;
  closeMenu: () => void;
};

const MobileNavContext = createContext<MobileNavContextValue | null>(null);

export function MobileNavProvider({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const value = useMemo(
    () => ({ menuOpen, setMenuOpen, openMenu, closeMenu }),
    [menuOpen, openMenu, closeMenu],
  );
  return <MobileNavContext.Provider value={value}>{children}</MobileNavContext.Provider>;
}

export function useMobileNav() {
  const ctx = useContext(MobileNavContext);
  if (!ctx) throw new Error("useMobileNav must be used within MobileNavProvider");
  return ctx;
}

export function useMobileNavOptional() {
  return useContext(MobileNavContext);
}
