let isDarkMode = false;

function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
  updateThemeIcon(); // Garantir que o ícone do tema seja atualizado ao inicializar
}

function toggleTheme() {
  if (isDarkMode) {
    disableDarkMode();
    saveTheme('light');
  } else {
    enableDarkMode();
    saveTheme('dark');
  }
  updateThemeIcon(); // Atualizar o ícone do tema após alternar o tema
}

function enableDarkMode() {
  document.documentElement.classList.add('dark');
  isDarkMode = true;
}

function disableDarkMode() {
  document.documentElement.classList.remove('dark');
  isDarkMode = false;
}

function saveTheme(theme) {
  localStorage.setItem('theme', theme);
}

function getThemeIcon() {
  return isDarkMode ? 'pi pi-moon text-sm' : 'pi pi-sun text-sm';
}

function updateThemeIcon() {
  const themeIconElement = document.getElementById('themeIcon'); // Substitua com o ID do elemento onde você exibe o ícone do tema
  if (themeIconElement) {
    themeIconElement.className = getThemeIcon();
  }
}

// Chamar initializeTheme() na inicialização da sua aplicação
initializeTheme();

export {
  isDarkMode,
  initializeTheme,
  toggleTheme,
  getThemeIcon
};
