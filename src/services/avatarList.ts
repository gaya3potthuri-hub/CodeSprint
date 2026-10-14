/**
 * 8 Game Cartoon Avatars with self-contained, offline-ready SVG data URIs
 */

export interface AvatarOption {
  id: string;
  name: string;
  url: string;
}

const encodeSvg = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'fox',
    name: 'Cyber Fox',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="24" fill="#F97316"/>
        <polygon points="20,20 35,45 15,45" fill="#C2410C"/>
        <polygon points="80,20 65,45 85,45" fill="#C2410C"/>
        <circle cx="50" cy="55" r="32" fill="#FB923C"/>
        <polygon points="50,42 28,68 72,68" fill="#FFFFFF"/>
        <circle cx="38" cy="50" r="5" fill="#1E293B"/>
        <circle cx="62" cy="50" r="5" fill="#1E293B"/>
        <circle cx="40" cy="48" r="1.5" fill="#FFFFFF"/>
        <circle cx="64" cy="48" r="1.5" fill="#FFFFFF"/>
        <polygon points="50,60 44,66 56,66" fill="#0F172A"/>
      </svg>
    `)
  },
  {
    id: 'robot',
    name: 'Byte Bot',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="24" fill="#0EA5E9"/>
        <line x1="50" y1="12" x2="50" y2="24" stroke="#38BDF8" stroke-width="4"/>
        <circle cx="50" cy="12" r="6" fill="#FACC15"/>
        <rect x="22" y="25" width="56" height="46" rx="12" fill="#E2E8F0" stroke="#0284C7" stroke-width="3"/>
        <rect x="30" y="34" width="40" height="18" rx="6" fill="#0F172A"/>
        <circle cx="40" cy="43" r="4" fill="#38BDF8"/>
        <circle cx="60" cy="43" r="4" fill="#38BDF8"/>
        <line x1="36" y1="60" x2="64" y2="60" stroke="#0284C7" stroke-width="3" stroke-linecap="round"/>
        <rect x="14" y="40" width="8" height="16" rx="4" fill="#38BDF8"/>
        <rect x="78" y="40" width="8" height="16" rx="4" fill="#38BDF8"/>
      </svg>
    `)
  },
  {
    id: 'wizard',
    name: 'Code Wizard',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="24" fill="#7C3AED"/>
        <polygon points="50,10 20,48 80,48" fill="#5B21B6"/>
        <ellipse cx="50" cy="48" rx="36" ry="7" fill="#4C1D95"/>
        <polygon points="50,22 53,28 58,28 54,32 56,38 50,34 44,38 46,32 42,28 47,28" fill="#FBBF24"/>
        <circle cx="50" cy="58" r="22" fill="#FED7AA"/>
        <circle cx="42" cy="56" r="3.5" fill="#1E293B"/>
        <circle cx="58" cy="56" r="3.5" fill="#1E293B"/>
        <path d="M 32,68 C 32,88 68,88 68,68 Z" fill="#F8FAFC"/>
      </svg>
    `)
  },
  {
    id: 'cat',
    name: 'Hacker Cat',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="24" fill="#EC4899"/>
        <polygon points="22,22 36,46 16,44" fill="#BE185D"/>
        <polygon points="78,22 64,46 84,44" fill="#BE185D"/>
        <circle cx="50" cy="56" r="30" fill="#F472B6"/>
        <ellipse cx="40" cy="52" rx="5" ry="7" fill="#047857"/>
        <ellipse cx="60" cy="52" rx="5" ry="7" fill="#047857"/>
        <polygon points="50,62 46,65 54,65" fill="#831843"/>
        <line x1="22" y1="62" x2="38" y2="64" stroke="#831843" stroke-width="2"/>
        <line x1="22" y1="68" x2="38" y2="67" stroke="#831843" stroke-width="2"/>
        <line x1="78" y1="62" x2="62" y2="64" stroke="#831843" stroke-width="2"/>
        <line x1="78" y1="68" x2="62" y2="67" stroke="#831843" stroke-width="2"/>
      </svg>
    `)
  },
  {
    id: 'astronaut',
    name: 'Astro Coder',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="24" fill="#1E293B"/>
        <circle cx="50" cy="50" r="34" fill="#F8FAFC" stroke="#64748B" stroke-width="3"/>
        <ellipse cx="50" cy="48" rx="24" ry="18" fill="#0284C7"/>
        <ellipse cx="44" cy="44" rx="8" ry="4" fill="#38BDF8" opacity="0.6"/>
        <rect x="36" y="74" width="28" height="10" rx="4" fill="#E2E8F0"/>
        <circle cx="44" cy="79" r="2" fill="#EF4444"/>
        <circle cx="56" cy="79" r="2" fill="#10B981"/>
      </svg>
    `)
  },
  {
    id: 'ninja',
    name: 'Logic Ninja',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="24" fill="#111827"/>
        <circle cx="50" cy="50" r="32" fill="#1F2937"/>
        <rect x="22" y="32" width="56" height="12" rx="4" fill="#DC2626"/>
        <rect x="26" y="44" width="48" height="16" rx="4" fill="#FED7AA"/>
        <circle cx="40" cy="52" r="3.5" fill="#0F172A"/>
        <circle cx="60" cy="52" r="3.5" fill="#0F172A"/>
      </svg>
    `)
  },
  {
    id: 'dino',
    name: 'Dino Dev',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="24" fill="#10B981"/>
        <polygon points="30,16 36,26 26,26" fill="#047857"/>
        <polygon points="44,14 50,24 40,24" fill="#047857"/>
        <polygon points="58,16 64,26 54,26" fill="#047857"/>
        <ellipse cx="50" cy="54" rx="30" ry="26" fill="#34D399"/>
        <circle cx="40" cy="48" r="4.5" fill="#064E3B"/>
        <circle cx="60" cy="48" r="4.5" fill="#064E3B"/>
        <circle cx="42" cy="46" r="1.5" fill="#FFFFFF"/>
        <circle cx="62" cy="46" r="1.5" fill="#FFFFFF"/>
        <ellipse cx="44" cy="62" rx="2" ry="3" fill="#065F46"/>
        <ellipse cx="56" cy="62" rx="2" ry="3" fill="#065F46"/>
      </svg>
    `)
  },
  {
    id: 'knight',
    name: 'Sprint Knight',
    url: encodeSvg(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" rx="24" fill="#EAB308"/>
        <path d="M 50,14 C 40,22 40,32 50,32 C 60,32 60,22 50,14 Z" fill="#DC2626"/>
        <rect x="25" y="32" width="50" height="42" rx="12" fill="#E2E8F0" stroke="#94A3B8" stroke-width="3"/>
        <rect x="34" y="44" width="32" height="7" rx="3.5" fill="#0F172A"/>
        <line x1="50" y1="44" x2="50" y2="64" stroke="#94A3B8" stroke-width="2"/>
        <circle cx="42" cy="60" r="1.5" fill="#64748B"/>
        <circle cx="58" cy="60" r="1.5" fill="#64748B"/>
      </svg>
    `)
  }
];
