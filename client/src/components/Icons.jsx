import React from 'react';

// Icon set — thin, precise, engineering feel
export const Icon = ({ children, size = 20, stroke = 1.5, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...rest}
  >
    {children}
  </svg>
);

export const IconCheck = (p) => <Icon {...p}><path d="M20 6L9 17l-5-5" /></Icon>;
export const IconArrowRight = (p) => <Icon {...p}><path d="M5 12h14M13 5l7 7-7 7" /></Icon>;
export const IconArrowLeft = (p) => <Icon {...p}><path d="M19 12H5M12 5l-7 7 7 7" /></Icon>;
export const IconPlus = (p) => <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>;
export const IconMinus = (p) => <Icon {...p}><path d="M5 12h14" /></Icon>;
export const IconChevronDown = (p) => <Icon {...p}><path d="M6 9l6 6 6-6" /></Icon>;

// Facility icons
export const IconFactory = (p) => (
  <Icon {...p}>
    <path d="M3 21V10l6 3V10l6 3V6l6-3v18H3z" />
    <path d="M7 17h1M11 17h1M15 17h1M19 17h1" />
  </Icon>
);
export const IconWarehouse = (p) => (
  <Icon {...p}>
    <path d="M3 21V9l9-5 9 5v12" />
    <path d="M8 21v-6h8v6M8 13h8" />
  </Icon>
);
export const IconSnowflake = (p) => (
  <Icon {...p}>
    <path d="M12 3v18M4.93 6.93l14.14 14.14M20 8l-8 4-8-4M20 16l-8-4-8 4M6.93 6.93l14.14 14.14" />
  </Icon>
);
export const IconBuilding = (p) => (
  <Icon {...p}>
    <rect x="4" y="3" width="16" height="18" rx="1" />
    <path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" />
  </Icon>
);
export const IconHospital = (p) => (
  <Icon {...p}>
    <rect x="3" y="7" width="18" height="14" rx="1" />
    <path d="M8 3v4M16 3v4M12 11v6M9 14h6" />
  </Icon>
);
export const IconHotel = (p) => (
  <Icon {...p}>
    <path d="M3 21V6h18v15M3 11h18M6 8h1M10 8h1M14 8h1M18 8h1M6 14h1M10 14h1M14 14h1M18 14h1M6 18h1M10 18h1M14 18h1M18 18h1" />
  </Icon>
);
export const IconSchool = (p) => (
  <Icon {...p}>
    <path d="M12 3L2 8l10 5 10-5-10-5z" />
    <path d="M6 10.5V16c0 1 2.5 3 6 3s6-2 6-3v-5.5" />
    <path d="M22 8v6" />
  </Icon>
);
export const IconRetail = (p) => (
  <Icon {...p}>
    <path d="M3 8h18l-2 12H5L3 8z" />
    <path d="M8 8V5a4 4 0 0 1 8 0v3" />
  </Icon>
);
export const IconOther = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 10.5a3 3 0 1 1 4 2.83c-.6.24-1 .8-1 1.42V16" />
    <path d="M12 19h.01" />
  </Icon>
);

// Section icons
export const IconSpark = (p) => (
  <Icon {...p}>
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
  </Icon>
);
export const IconWallet = (p) => (
  <Icon {...p}>
    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6" />
    <path d="M22 11h-6a2 2 0 0 0 0 4h6M4 7V5a2 2 0 0 1 2-2h11" />
  </Icon>
);
export const IconTools = (p) => (
  <Icon {...p}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </Icon>
);
export const IconChart = (p) => (
  <Icon {...p}>
    <path d="M3 3v18h18M7 15l4-4 4 4 5-5" />
  </Icon>
);
export const IconClock = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Icon>
);
export const IconShield = (p) => (
  <Icon {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </Icon>
);
export const IconGrid = (p) => (
  <Icon {...p}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </Icon>
);
export const IconBolt = (p) => (
  <Icon {...p}>
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
  </Icon>
);
export const IconSun = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Icon>
);


