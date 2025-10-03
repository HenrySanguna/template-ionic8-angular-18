/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--ion-color-primary)',
        'primary-rgb': 'var(--ion-color-primary-rgb)',
        'primary-contrast': 'var(--ion-color-primary-contrast)',
        secondary: 'var(--ion-color-secondary)',
        tertiary: 'var(--ion-color-tertiary)',
        success: 'var(--ion-color-success)',
        warning: 'var(--ion-color-warning)',
        danger: 'var(--ion-color-danger)',
        light: 'var(--ion-color-light)',
        medium: 'var(--ion-color-medium)',
        dark: 'var(--ion-color-dark)',
      },
    },
  },
  plugins: [],
}

