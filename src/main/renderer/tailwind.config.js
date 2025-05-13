export const content = ['./src/**/*.{js,jsx,ts,tsx,html}', './index.html', './public/index.html'];
export const darkMode = 'media';
export const theme = {
  extend: {
    colors: {
      primary: "#22331D",
      secondary: "#6A6D69",
      background: "#EFEDE7",
      accent: "#F65A11",
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      serif: ['ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
    }
  },
};
export const variants = {
  extend: { },
};
export const plugins = [];
