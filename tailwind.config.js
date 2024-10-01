/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/slices/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: 'Josefin Sans',
    },
    extend: {
      container: {
        center: true,  // Ensure the container is centered
        padding: '1rem',  // Add padding if necessary
      },
      screens: {
        '2xl': '600px', // Set max-width for larger screens to 1260px
      },
      colors: {
        customBorder: '#2176ff',
        customBg: '#e4ecf9',
        mainText: '#1e1f24',
      }
    },
  },
  plugins: [],
};
