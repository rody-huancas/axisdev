import { useTranslation } from "./provider";

export function useGreeting() {
  const { t, language } = useTranslation();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) {
      return language === "es" ? t.common.goodMorning : t.common.goodMorning;
    } else if (hour >= 12 && hour < 18) {
      return language === "es" ? t.common.goodAfternoon : t.common.goodAfternoon;
    } else {
      return language === "es" ? t.common.goodEvening : t.common.goodEvening;
    }
  };

  return getGreeting();
}
