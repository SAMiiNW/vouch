import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // pale light surfaces
        base: {
          DEFAULT: '#eef0f4',
          deep: '#e4e7ee',
          raised: '#f3f5f9',
        },
        ink: {
          DEFAULT: '#2b2f3a',
          soft: '#5b6273',
          faint: '#9aa1b2',
        },
        // single pastel accent: periwinkle to mint
        peri: {
          DEFAULT: '#7c83ff',
          soft: '#9ba0ff',
          deep: '#5a62e6',
        },
        mint: '#54d6b4',
        // ruling semantics, all kept soft/pastel for the light theme
        trusted: '#36b89a',
        mixed: '#e0a93a',
        unverified: '#e2738a',
      },
      fontFamily: {
        display: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        body: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'monospace'],
      },
      borderRadius: {
        soft: '1.25rem',
        pill: '2rem',
      },
      boxShadow: {
        // raised neumorphic extrusion (light top-left, dark bottom-right)
        raised: '8px 8px 18px rgba(180,187,204,0.7), -8px -8px 18px rgba(255,255,255,0.95)',
        'raised-sm': '5px 5px 11px rgba(180,187,204,0.6), -5px -5px 11px rgba(255,255,255,0.9)',
        'raised-lg': '14px 14px 30px rgba(176,183,201,0.7), -14px -14px 30px rgba(255,255,255,0.95)',
        // inset wells for inputs
        inset: 'inset 5px 5px 11px rgba(180,187,204,0.7), inset -5px -5px 11px rgba(255,255,255,0.95)',
        'inset-sm': 'inset 3px 3px 7px rgba(180,187,204,0.65), inset -3px -3px 7px rgba(255,255,255,0.9)',
        // accent glow
        glow: '0 10px 30px rgba(124,131,255,0.35)',
      },
      keyframes: {
        riseup: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulsechip: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        flashframe: {
          '0%': { boxShadow: '0 0 0 0 rgba(54,184,154,0.55), 8px 8px 18px rgba(180,187,204,0.7), -8px -8px 18px rgba(255,255,255,0.95)' },
          '100%': { boxShadow: '0 0 0 16px rgba(54,184,154,0), 8px 8px 18px rgba(180,187,204,0.7), -8px -8px 18px rgba(255,255,255,0.95)' },
        },
        spinslow: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        riseup: 'riseup 0.5s ease-out forwards',
        pulsechip: 'pulsechip 1.5s ease-in-out infinite',
        flashframe: 'flashframe 1.4s ease-out forwards',
        spinslow: 'spinslow 14s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
