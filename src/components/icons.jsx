const common = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const IconGavel = (p) => (
  <svg {...common} {...p}>
    <path d="M14 4l6 6M6 12L2 16l2 2 4-4M9.5 6.5l8 8M12 9l-6 6" />
  </svg>
);

export const IconTruck = (p) => (
  <svg {...common} {...p}>
    <path d="M2 7h11v9H2zM13 10h4l3 3v3h-7z" />
    <circle cx="6" cy="18" r="1.6" />
    <circle cx="17" cy="18" r="1.6" />
  </svg>
);

export const IconLayers = (p) => (
  <svg {...common} {...p}>
    <path d="M12 3l9 5-9 5-9-5 9-5z" />
    <path d="M3 13l9 5 9-5M3 8v5l9 5 9-5V8" />
  </svg>
);

export const IconLink = (p) => (
  <svg {...common} {...p}>
    <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />
  </svg>
);

export const IconTarget = (p) => (
  <svg {...common} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="0.8" fill="currentColor" />
  </svg>
);

export const IconChat = (p) => (
  <svg {...common} {...p}>
    <path d="M3 12a7.5 7.5 0 0 1 12.9-5.2A7.5 7.5 0 0 1 8.5 19L4 20l1-4.5A7.4 7.4 0 0 1 3 12z" />
  </svg>
);

export const IconShield = (p) => (
  <svg {...common} {...p}>
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const IconHelmet = (p) => (
  <svg {...common} {...p}>
    <path d="M3 16a9 9 0 0 1 18 0z" />
    <path d="M3 16h18M12 4v3M8 7l-1 2M16 7l1 2" />
  </svg>
);

export const IconBlueprint = (p) => (
  <svg {...common} {...p}>
    <rect x="3" y="4" width="18" height="16" rx="1" />
    <path d="M7 8h6M7 12h10M7 16h4" />
  </svg>
);

export const IconMap = (p) => (
  <svg {...common} {...p}>
    <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
    <path d="M9 4v14M15 6v14" />
  </svg>
);

export const IconClock = (p) => (
  <svg {...common} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7v5l3.5 2" />
  </svg>
);

export const IconCheck = (p) => (
  <svg {...common} {...p}>
    <path d="M4 12l5 5L20 6" />
  </svg>
);

export const IconArrowRight = (p) => (
  <svg {...common} {...p}>
    <path d="M4 12h16M13 5l7 7-7 7" />
  </svg>
);

export const IconWallet = (p) => (
  <svg {...common} {...p}>
    <rect x="3" y="6" width="18" height="13" rx="2" />
    <path d="M3 10h18M16 14.5h2" />
  </svg>
);

export const IconUsers = (p) => (
  <svg {...common} {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <circle cx="17" cy="9" r="2.4" />
    <path d="M15.5 14a5 5 0 0 1 5.5 5.6" />
  </svg>
);

export const IconBuilding = (p) => (
  <svg {...common} {...p}>
    <rect x="4" y="3" width="10" height="18" />
    <rect x="14" y="9" width="6" height="12" />
    <path d="M7 7h1M10 7h1M7 11h1M10 11h1M7 15h1M10 15h1" />
  </svg>
);

export const IconMegaphone = (p) => (
  <svg {...common} {...p}>
    <path d="M3 10v4a1 1 0 0 0 1 1h2l10 4V5L6 9H4a1 1 0 0 0-1 1z" />
    <path d="M8 15v4a1.5 1.5 0 0 0 3 0v-3" />
    <path d="M19 9.5a3.5 3.5 0 0 1 0 5" />
  </svg>
);

export const IconBriefcase = (p) => (
  <svg {...common} {...p}>
    <rect x="2.5" y="7" width="19" height="13" rx="1.5" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M2.5 12.5h19" />
  </svg>
);

export const IconSparkle = (p) => (
  <svg {...common} {...p}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
    <path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
  </svg>
);

export const IconStar = (p) => (
  <svg {...common} {...p}>
    <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8z" />
  </svg>
);

export const IconTrendingUp = (p) => (
  <svg {...common} {...p}>
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M15 6h6v6" />
  </svg>
);

export const IconTool = (p) => (
  <svg {...common} {...p}>
    <path d="M15.5 3.5a5 5 0 0 0-6.1 6.6L3.6 15.9a2 2 0 0 0 2.8 2.8l5.8-5.8a5 5 0 0 0 6.6-6.1l-2.9 2.9-2.6-.7-.7-2.6z" />
  </svg>
);

export const IconPackage = (p) => (
  <svg {...common} {...p}>
    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
    <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
    <path d="M8 5.2l8 4.6" />
  </svg>
);

export const IconBolt = (p) => (
  <svg {...common} {...p}>
    <circle cx="7.5" cy="7.5" r="3.5" />
    <path d="M7.5 4v7M4 7.5h7" />
    <path d="M10.2 10.2l9 9M17 18.5l2.5-2.5" />
  </svg>
);

export const IconScale = (p) => (
  <svg {...common} {...p}>
    <path d="M12 4v16M7 20h10" />
    <path d="M4 8h16M4 8l-2.5 5a3 3 0 0 0 5 0L4 8zM20 8l-2.5 5a3 3 0 0 0 5 0L20 8z" />
  </svg>
);

export const IconLock = (p) => (
  <svg {...common} {...p}>
    <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
  </svg>
);

export const IconX = (p) => (
  <svg {...common} {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const IconDownload = (p) => (
  <svg {...common} {...p}>
    <path d="M12 3v12M7 10l5 5 5-5" />
    <path d="M3 17v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
  </svg>
);

export const IconPlay = (p) => (
  <svg {...common} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M10 8.5l6 3.5-6 3.5z" fill="currentColor" stroke="none" />
  </svg>
);

export const IconCalendar = (p) => (
  <svg {...common} {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

export const IconQuote = (p) => (
  <svg {...common} {...p}>
    <path d="M3 21c3 0 7-1 7-8V5H4v8h3c0 3.5-1 5.5-4 6zM14 21c3 0 7-1 7-8V5h-6v8h3c0 3.5-1 5.5-4 6z" fill="currentColor" stroke="none" opacity="0.9" />
  </svg>
);

export const IconMail = (p) => (
  <svg {...common} {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);

export const IconSearch = (p) => (
  <svg {...common} {...p}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m21 21-5-5" />
  </svg>
);

export const IconColumns = (p) => (
  <svg {...common} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18M15 3v18" />
  </svg>
);

export const IconRows = (p) => (
  <svg {...common} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M3 15h18" />
  </svg>
);

export const IconBookmark = (p) => (
  <svg {...common} {...p}>
    <path d="M19 21 12 16 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

export const IconKeyboard = (p) => (
  <svg {...common} {...p}>
    <rect x="2" y="6" width="20" height="13" rx="2" />
    <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8M6 14h.01M18 14h.01" />
  </svg>
);

export const IconMapPin = (p) => (
  <svg {...common} {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);

export const IconWarehouse = (p) => (
  <svg {...common} {...p}>
    <path d="M3 20V9l9-5 9 5v11" />
    <path d="M7 20v-7h10v7M7 16.5h10" />
  </svg>
);

export const IconClipboard = (p) => (
  <svg {...common} {...p}>
    <rect x="5" y="4.5" width="14" height="16.5" rx="2" />
    <path d="M9 4.5V3.5h6v1M9 10h6M9 13.5h6M9 17h3.5" />
  </svg>
);

export const IconSliders = (p) => (
  <svg {...common} {...p}>
    <path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1" />
    <circle cx="15" cy="6" r="2" />
    <circle cx="9" cy="12" r="2" />
    <circle cx="17" cy="18" r="2" />
  </svg>
);

export const IconArrowLeft = (p) => (
  <svg {...common} {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

export const IconPrinter = (p) => (
  <svg {...common} {...p}>
    <path d="M7 8V3.5h10V8" />
    <rect x="3.5" y="8" width="17" height="8.5" rx="2" />
    <path d="M7 14h10v6.5H7z" />
  </svg>
);

export const IconExternal = (p) => (
  <svg {...common} {...p}>
    <path d="M14 4h6v6M20 4l-9 9" />
    <path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
  </svg>
);

export const IconZap = (p) => (
  <svg {...common} {...p}>
    <path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3z" />
  </svg>
);

export const IconBulb = (p) => (
  <svg {...common} {...p}>
    <path d="M9 18h6M10 21h4" />
    <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
  </svg>
);

export const IconFan = (p) => (
  <svg {...common} {...p}>
    <circle cx="12" cy="12" r="1.6" />
    <path d="M12 10.4c-1-3.2-.2-6.4 2.2-6.4 2.8 0 2.2 4.6-2.2 6.4zM13.6 12c3.2-1 6.4-.2 6.4 2.2 0 2.8-4.6 2.2-6.4-2.2zM12 13.6c1 3.2.2 6.4-2.2 6.4-2.8 0-2.2-4.6 2.2-6.4zM10.4 12c-3.2 1-6.4.2-6.4-2.2 0-2.8 4.6-2.2 6.4 2.2z" />
  </svg>
);

export const IconDroplet = (p) => (
  <svg {...common} {...p}>
    <path d="M12 3.5s-6 6.6-6 11a6 6 0 0 0 12 0c0-4.4-6-11-6-11z" />
  </svg>
);

export const IconBrick = (p) => (
  <svg {...common} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <path d="M3 9.7h18M3 14.3h18M9 5v4.7M15 9.7v4.6M9 14.3V19" />
  </svg>
);

export const IconRoof = (p) => (
  <svg {...common} {...p}>
    <path d="M2.5 12 12 4.5l9.5 7.5" />
    <path d="M5 10v9.5h14V10M9.5 19.5v-5h5v5" />
  </svg>
);

export const IconRuler = (p) => (
  <svg {...common} {...p}>
    <path d="M3.5 16.5 16.5 3.5l4 4-13 13z" />
    <path d="M7 13l2 2M10 10l1.5 1.5M13 7l2 2" />
  </svg>
);

export const IconScrew = (p) => (
  <svg {...common} {...p}>
    <path d="M8 3.5h8l-1 3H9z" />
    <path d="M12 6.5v14M9.5 9l5 1.5M9.5 12.5l5 1.5M9.5 16l5 1.5" />
  </svg>
);
