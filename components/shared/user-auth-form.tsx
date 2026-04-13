"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export const UserAuthForm = () => {
  const [isPending, startTransition] = useTransition();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleGoogle = () => {
    if (isRedirecting) {
      return;
    }

    setIsRedirecting(true);
    startTransition(() => {
      void signIn("google", { callbackUrl: "/dashboard" }).catch(() => {
        setIsRedirecting(false);
      });
    });
  };

  return (
    <div className="w-full">
      <Button
        className="w-full rounded-xl border border-white/20 bg-white py-2.5 text-slate-900 shadow-lg transition hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isPending || isRedirecting}
        onClick={handleGoogle}
        aria-busy={isPending || isRedirecting}
      >
        <span className="flex items-center justify-center gap-2.5">
          <svg
            aria-hidden="true"
            viewBox="0 0 48 48"
            className="h-5 w-5"
          >
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303C33.657 32.91 29.168 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.272 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.65-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.272 4 24 4 16.318 4 9.656 8.257 6.306 14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.066 0 9.801-1.94 13.334-5.083l-6.157-5.209C29.164 35.271 26.715 36 24 36c-5.145 0-9.623-3.06-11.287-7.438l-6.521 5.025C9.505 39.556 16.227 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303c-.792 2.235-2.231 4.155-4.126 5.508l.003-.002 6.157 5.209C36.903 39.455 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
            />
          </svg>
          {isPending || isRedirecting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
              <span>Conectando...</span>
            </span>
          ) : (
            <span className="text-sm font-medium">Continuar con Google</span>
          )}
        </span>
      </Button>
    </div>
  );
};
