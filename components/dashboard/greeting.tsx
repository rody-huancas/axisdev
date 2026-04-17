"use client";

import { useTranslation } from "@/lib/i18n";

interface GreetingProps {
  userName: string;
}

export function Greeting({ userName }: GreetingProps) {
  const { t } = useTranslation();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return t.common.goodMorning;
    if (hour >= 12 && hour < 18) return t.common.goodAfternoon;
    return t.common.goodEvening;
  };

  return <>{getGreeting()}, {userName}</>;
}
