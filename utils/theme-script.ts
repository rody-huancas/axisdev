export const themeScript = `
  (function() {
    try {
      const storage    = localStorage.getItem('rody-theme-storage');
      const theme      = storage ? JSON.parse(storage).state.theme : null;
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (theme === 'dark' || (!theme && systemDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error("Error en theme-script:", e);
    }
  })();
`;
