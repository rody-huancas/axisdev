import { useTranslation } from "./provider";

export function useGreeting() {
  const { t } = useTranslation();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) {
      return t.common.goodMorning;
    } else if (hour >= 12 && hour < 18) {
      return t.common.goodAfternoon;
    } else {
      return t.common.goodEvening;
    }
  };

  return getGreeting();
}
