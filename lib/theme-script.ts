export const themeScript = `
  (function() {
    function setTheme(dark) {
      if (dark) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }

    try {
      var theme   = 'dark';
      var storage = localStorage.getItem('rody-theme-storage');
      if (storage) {
        var parsed = JSON.parse(storage);
        if (parsed.state && parsed.state.theme) {
          theme = parsed.state.theme;
        }
      }
      if (theme === 'system') {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      setTheme(theme === 'dark');
    } catch (e) {
      setTheme(true);
    }
  })();
`;
