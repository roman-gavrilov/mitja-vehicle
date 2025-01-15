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
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(192deg, #d4d5de 0%, #bdb8e6 60%, #ffffff 100%)',
      },
      backgroundSize: {
        '400%': '400%',
      },
      animation: {
        bganimation: 'bganimation 5s infinite',
      },
      keyframes: {
        bganimation: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
};
