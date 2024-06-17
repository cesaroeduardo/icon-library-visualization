let isDarkMode = false;

function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    isDarkMode = true;
  }
}

function toggleTheme() {
  isDarkMode = !isDarkMode;
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

function getThemeIcon() {
  return isDarkMode ? 'pi pi-moon' : 'pi pi-sun';
}

export {
  isDarkMode,
  initializeTheme,
  toggleTheme,
  getThemeIcon
};
