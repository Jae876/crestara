module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'crestara-dark':   '#060d17',
        'crestara-navy':   '#0a1520',
        'crestara-blue':   '#0d2040',
        'crestara-mid':    '#112a50',
        'crestara-teal':   '#00c4b4',
        'crestara-cyan':   '#1e90ff',
        'crestara-gold':   '#c9a96e',
        'crestara-amber':  '#ffd700',
        'crestara-silver': '#d9d5c8',
        'crestara-muted':  '#6b7e96',
        'crestara-border': '#1a3050',
        'success': '#48bb78',
        'danger':  '#f56565',
        'warning': '#ed8936',
      },
      backgroundImage: {
        'gradient-crestara':  'linear-gradient(135deg, #060d17 0%, #0a1520 50%, #0d2040 100%)',
        'gradient-neon':      'linear-gradient(135deg, #00c4b4 0%, #1e90ff 100%)',
        'gradient-gold':      'linear-gradient(135deg, #c9a96e 0%, #ffd700 100%)',
        'gradient-card':      'linear-gradient(135deg, rgba(13,32,64,0.8) 0%, rgba(10,21,32,0.9) 100%)',
        'gradient-hero':      'radial-gradient(ellipse at center, #0d2040 0%, #060d17 70%)',
      },
      fontFamily: {
        'sans':    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'heading': ['Orbitron', 'Inter', 'system-ui', 'sans-serif'],
        'mono':    ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow':        '0 0 20px rgba(0,196,180,0.45), 0 0 40px rgba(0,196,180,0.2)',
        'glow-sm':     '0 0 10px rgba(0,196,180,0.35)',
        'glow-blue':   '0 0 20px rgba(30,144,255,0.45)',
        'glow-gold':   '0 0 20px rgba(201,169,110,0.5)',
        'card':        '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover':  '0 8px 40px rgba(0,196,180,0.15)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'float':      'float 4s ease-in-out infinite',
        'ticker':     'ticker 30s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0,196,180,0.3)' },
          '50%':       { boxShadow: '0 0 30px rgba(0,196,180,0.7)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(-8px)' },
        },
        'ticker': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
