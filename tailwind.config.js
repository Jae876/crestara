module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'crestara-dark': '#0a0e12',
        'crestara-blue': '#001f3f',
        'crestara-teal': '#00c4b4',
        'crestara-cyan': '#1e90ff',
        'crestara-gold': '#c9a96e',
        'crestara-silver': '#d9d5c8',
        'crestara-border': '#1a2940',
      },
      backgroundImage: {
        'gradient-crestara': 'linear-gradient(135deg, #0a0e12 0%, #001f3f 100%)',
        'gradient-neon': 'linear-gradient(135deg, #00c4b4 0%, #1e90ff 100%)',
      },
      fontFamily: {
        'sans': ['system-ui', '-apple-system', 'sans-serif'],
        'heading': ['Orbitron', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 196, 180, 0.5)',
        'glow-secondary': '0 0 20px rgba(30, 144, 255, 0.5)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
