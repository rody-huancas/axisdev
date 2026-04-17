"use client";

import { ProgressProvider } from "@bprogress/next/app";
import { Toaster } from "sileo";
import { TranslationProvider } from "@/lib/i18n";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressProvider
      height="3px"
      color="var(--axis-accent)"
      options={{ showSpinner: false }}
      shallowRouting
    >
      <Toaster position="top-right" />
      <TranslationProvider>
        {children}
      </TranslationProvider>
    </ProgressProvider>
  );
};

export default Providers;
