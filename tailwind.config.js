/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: 'var(--clr-cyan)',
          magenta: 'var(--clr-magenta)',
          green: 'var(--clr-green)',
          yellow: 'var(--clr-yellow)',
          purple: 'var(--clr-purple)',
          orange: 'var(--clr-orange)',
          red: 'var(--clr-red)',
        },
        cyber: {
          bg: {
            deep: 'var(--clr-bg-deep)',
            base: 'var(--clr-bg-base)',
            elevated: 'var(--clr-bg-elevated)',
            surface: 'var(--clr-bg-surface)',
            hover: 'var(--clr-bg-hover)',
          }
        }
      },
      fontFamily: {
        mono: 'var(--font-mono)',
        display: 'var(--font-display)',
        body: 'var(--font-body)',
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'scaleIn': 'scaleIn 0.25s cubic-bezier(0.16,1,0.3,1) forwards',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'border-shine': 'border-shine 4s linear infinite',
        'gradient-shift': 'gradient-shift 20s ease infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeInUp: { from: { opacity:'0', translate:'0 12px' }, to: { opacity:'1', translate:'0 0' } },
        scaleIn: { from: { opacity:'0', scale:'.95' }, to: { opacity:'1', scale:'1' } },
        float: { '0%,100%': { translate:'0 0' }, '50%': { translate:'0 -6px' } },
        'pulse-glow': {
          '0%,100%': { boxShadow: '0 0 4px rgba(0,240,255,.15)' },
          '50%': { boxShadow: '0 0 16px rgba(0,240,255,.3)' }
        },
        'border-shine': { to: { backgroundPosition: '200% 0' } },
        'gradient-shift': { '0%,100%': { backgroundPosition:'0% 50%' }, '50%': { backgroundPosition:'100% 50%' } },
        shimmer: { to: { backgroundPosition:'200% 0' } },
      },
    },
  },
  plugins: [],
}
