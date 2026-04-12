"use client";

import { ProgressProvider } from "@bprogress/next/app";
import { Toaster } from "sileo";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressProvider
      height="3px"
      color="var(--axis-accent)"
      options={{ showSpinner: false }}
      shallowRouting
    >
      <Toaster position="top-right" />
      {children}
    </ProgressProvider>
  );
};

export default Providers;
