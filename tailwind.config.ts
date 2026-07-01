import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        block: {
          sky: '#58C7F3',
          skyDeep: '#268BD2',
          cloud: '#F5FBFF',
          grass: '#4CC44A',
          grassDark: '#268B3A',
          leaf: '#1F7A33',
          dirt: '#8B5A2B',
          dirtDark: '#5B351D',
          wood: '#B7793C',
          sand: '#F3C95A',
          sandDark: '#C9912A',
          stone: '#8A929A',
          stoneDark: '#4F5964',
          cave: '#2A2B35',
          caveLight: '#5D6573',
          water: '#2EA8FF',
          gem: '#25D9C7',
          gold: '#FFD447',
          lava: '#F97316',
          ink: '#172033',
          parchment: '#FFF1B8',
        },
      },
      boxShadow: {
        block: '0 8px 0 #172033, 0 12px 18px rgba(23, 32, 51, 0.28)',
        'block-sm': '0 5px 0 #172033, 0 8px 14px rgba(23, 32, 51, 0.22)',
        insetBlock: 'inset -5px -5px 0 rgba(0,0,0,0.2), inset 5px 5px 0 rgba(255,255,255,0.25)',
      },
      fontFamily: {
        pixel: ['"Courier New"', 'Monaco', 'Consolas', 'monospace'],
        rounded: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'pixel-grid':
          'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
} satisfies Config;
