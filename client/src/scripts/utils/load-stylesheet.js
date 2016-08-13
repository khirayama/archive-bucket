export function loadStylesheet(filePath) {
  const link = document.createElement('link');
  const head = document.querySelector('head');

  link.rel = 'stylesheet';
  link.href = filePath;

  head.appendChild(link);
}
