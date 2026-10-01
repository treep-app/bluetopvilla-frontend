"use client";

import { MobileNavProvider } from "@/context/mobile-nav-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <MobileNavProvider>{children}</MobileNavProvider>
    </QueryClientProvider>
  );
}
