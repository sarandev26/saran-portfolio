/*
 * PROJECTS DATA — Selected Projects by Saran SM
 *
 * 5 Animated Showcase Websites
 * 10 TFrenzy End-to-End Enterprise & Digital Products
 */

export type Project = {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  origin?: "TFrenzy" | "Brillium Tech Solutions";
  hook: string;
  summary: string;
  liveUrl?: string;
  keyFeatures?: string[];
  screens?: string[];
  cover: {
    src: string;
    bg?: string;
    ink?: "light" | "dark";
    position?: string;
  };
};

export const PROJECTS: Project[] = [
  {
    "slug": "aurelia-coffee-house",
    "title": "Aurelia Coffee House Website",
    "category": "Animated",
    "tags": [
      "Animated · Web Design"
    ],
    "hook": "Premium animated cafe website.",
    "summary": "Premium animated cafe website with fluid scroll motion and warm, artisanal cafe aesthetics.",
    "liveUrl": "https://cafe-website-omega-inky.vercel.app/",
    "keyFeatures": [
      "Fluid scroll-driven storytelling with smooth section reveals",
      "Interactive table reservation and artisanal coffee menu showcase",
      "Warm editorial typography and premium coffeehouse aesthetics",
      "Fully responsive motion experience across desktop and mobile"
    ],
    "screens": [
      "/images/work/aurelia-coffee-house.jpg"
    ],
    "cover": {
      "src": "/images/work/aurelia-coffee-house.jpg",
      "bg": "#1a120b",
      "ink": "light"
    }
  },
  {
    "slug": "avengers-website",
    "title": "Avengers Website",
    "category": "Animated",
    "tags": [
      "Animated · Web Design"
    ],
    "hook": "Fan-made Avengers website with 3D animation.",
    "summary": "Fan-made Avengers website with 3D cinematic animations and dynamic character showcases.",
    "liveUrl": "https://avengers-website.vercel.app/",
    "keyFeatures": [
      "Immersive cinematic hero banner with dynamic character staging",
      "Interactive character dossiers, storyline arcs, and comic lore navigation",
      "Sound and motion design micro-interactions celebrating Marvel superhero identity",
      "High-performance media presentation optimized for all screens"
    ],
    "screens": [
      "/images/work/avengers-website.jpg"
    ],
    "cover": {
      "src": "/images/work/avengers-website.jpg",
      "bg": "#0e1424",
      "ink": "light"
    }
  },
  {
    "slug": "seven-star-luxury-hotel",
    "title": "7-Star Luxury Hotel Website",
    "category": "Animated",
    "tags": [
      "Animated · Web Design"
    ],
    "hook": "Luxury hotel website with premium scroll animation.",
    "summary": "Luxury hotel website with premium scroll animations and elegant editorial typography.",
    "liveUrl": "https://hotel-website-ecru-zeta.vercel.app/",
    "keyFeatures": [
      "Ultra-luxury architectural visual language with ambient scroll transitions",
      "Interactive presidential suites and bespoke villa virtual showcase",
      "Concierge booking experience with seamless reservation workflows",
      "Refined serif typography and understated gold luxury accents"
    ],
    "screens": [
      "/images/work/seven-star-luxury-hotel.jpg"
    ],
    "cover": {
      "src": "/images/work/seven-star-luxury-hotel.jpg",
      "bg": "#161311",
      "ink": "light"
    }
  },
  {
    "slug": "bite-and-roll-website",
    "title": "Bite & Roll Website",
    "category": "Animated",
    "tags": [
      "Animated · Web Design"
    ],
    "hook": "Premium scroll-animated food website.",
    "summary": "Premium scroll-animated food brand website featuring floating ingredients and interactive menus.",
    "liveUrl": "https://bite-and-roll-webiste.vercel.app/",
    "keyFeatures": [
      "Exploded 3D burger ingredient scroll animation with parallax layers",
      "Bold, street-style fast casual branding with high-energy typography",
      "Direct online food ordering journey and interactive menu explorer",
      "Engaging micro-animations designed to maximize appetite appeal"
    ],
    "screens": [
      "/images/work/bite-and-roll-website.jpg"
    ],
    "cover": {
      "src": "/images/work/bite-and-roll-website.jpg",
      "bg": "#1c140e",
      "ink": "light"
    }
  },
  {
    "slug": "sari-boutique-website",
    "title": "Sari Boutique Website",
    "category": "Animated",
    "tags": [
      "Animated · Web Design"
    ],
    "hook": "3D animated parallax scrolling boutique website.",
    "summary": "3D animated parallax scrolling boutique website highlighting heritage fabrics and modern couture.",
    "liveUrl": "https://saree-site-nu.vercel.app/",
    "keyFeatures": [
      "Cinematic chronicles storytelling capturing heritage sarees in historic Indian locales",
      "Interactive location and collection explorer with atmospheric ambient mood settings",
      "Fluid 3D parallax scroll journey revealing fabric weaves, drape dynamics, and golden zari accents",
      "Refined editorial typography and luxury couture brand presentation"
    ],
    "screens": [
      "/images/work/sari-boutique-website.jpg"
    ],
    "cover": {
      "src": "/images/work/sari-boutique-website.jpg",
      "bg": "#180d14",
      "ink": "light"
    }
  },
  {
    "slug": "asset-manager-mobile-app",
    "title": "Asset Management Mobile App",
    "category": "Mobile App",
    "tags": [
      "Mobile App",
      "In-House"
    ],
    "origin": "TFrenzy",
    "hook": "Field technicians shouldn't need a spreadsheet to know a machine's history.",
    "summary": "A shop-floor asset management mobile application built for factory technicians and plant supervisors. By replacing clipboard logs with instant QR scanning, the app allows workers to identify machinery, view maintenance records, and log equipment status directly on ruggedized mobile devices.",
    "keyFeatures": [
      "Machine registration with unique QR code generation",
      "Instant equipment lookup by scanning attached QR codes",
      "Asset inventory management and maintenance tracking",
      "Centralized equipment records accessible on mobile"
    ],
    "screens": [
      "/images/work/asset-manager-mobile-app-1.png",
      "/images/work/asset-manager-mobile-app-2.png"
    ],
    "cover": {
      "src": "/images/work/asset-manager-card.jpg",
      "bg": "#101827",
      "ink": "light",
      "position": "center 45%"
    }
  },
  {
    "slug": "plannpost-web-app",
    "title": "Plannpost Web App",
    "category": "Web App",
    "tags": [
      "Web App",
      "In-House"
    ],
    "origin": "TFrenzy",
    "hook": "Managing a brand's social presence usually means juggling five different tools.",
    "summary": "Managing a brand's social presence usually means juggling five different tools — this platform consolidates all of it into one connected workspace.",
    "keyFeatures": [
      "Content planning and post scheduling calendar",
      "Unified social inbox and team collaboration tools",
      "Analytics dashboards and Newsletter Studio",
      "Fully responsive mobile experience alongside the web app",
      "Reusable component-based design system"
    ],
    "screens": [
      "/images/work/plannpost-web-app-1.jpg",
      "/images/work/plannpost-web-app-2.jpg"
    ],
    "cover": {
      "src": "/images/work/plannpost-card.jpg",
      "bg": "#101827",
      "ink": "light"
    }
  },
  {
    "slug": "techflow-website",
    "title": "TechFlow Website",
    "category": "Web Design",
    "tags": [
      "Web Design",
      "In-House"
    ],
    "origin": "TFrenzy",
    "hook": "A store needs two experiences to work well together: smooth shopping and a clean control panel.",
    "summary": "A store needs two experiences to work well together — a smooth shopping journey for customers and a clean control panel for the team behind it.",
    "keyFeatures": [
      "Product browsing and shopping flows",
      "Order management and email templates",
      "Admin dashboard for store operations",
      "Scalable, reusable component system across both interfaces"
    ],
    "screens": [
      "/images/work/techflow-website-1.jpg",
      "/images/work/techflow-website-2.jpg"
    ],
    "cover": {
      "src": "/images/work/techflow-card.jpg",
      "bg": "#101827",
      "ink": "light"
    }
  },
  {
    "slug": "bizscan-mobile-app",
    "title": "BizScan Mobile App",
    "category": "Mobile App",
    "tags": [
      "Mobile App",
      "In-House"
    ],
    "origin": "TFrenzy",
    "hook": "Turn trade show business cards into actionable CRM leads in seconds with smart OCR scanning.",
    "summary": "BizScan is a smart business card scanning and contact management mobile app designed for networking events, expos, and sales professionals. It uses optical character recognition (OCR) to instantly digitize paper cards into categorized client leads, eliminating manual entry and speeding up follow-ups.",
    "keyFeatures": [
      "High-accuracy OCR card scanner with automated name, phone, email, and company parsing",
      "One-tap contact categorization separating client accounts, sales leads, and vendor contacts",
      "Quick-action dashboard displaying active lead counts and instant manual contact entry",
      "Direct export and sync capabilities to keep CRM and contact lists updated",
      "Clean, modern mobile interface designed for fast, seamless on-the-go networking"
    ],
    "screens": [
      "/images/work/bizscan-mobile-app-1.png"
    ],
    "cover": {
      "src": "/images/work/bizscan-card.jpg",
      "bg": "#101827",
      "ink": "light",
      "position": "center 50%"
    }
  },
  {
    "slug": "conveyor-belt-health-monitoring",
    "title": "Conveyor Belt Health Monitoring System (Desktop Application)",
    "category": "Software Design",
    "tags": [
      "Software Design",
      "In-House"
    ],
    "origin": "TFrenzy",
    "hook": "On the plant floor, a stalled conveyor costs money every minute.",
    "summary": "On the plant floor, a stalled conveyor costs money every minute — this platform gives operators eyes on every belt before it fails.",
    "keyFeatures": [
      "Plant-wide operational dashboards with real-time conveyor health status",
      "Live camera and thermal feed integration for visual and heat-based fault detection",
      "AI-driven defect detection and predictive analytics",
      "Performance tracking, event management, and system diagnostics",
      "Scalable design system built for multi-plant deployment"
    ],
    "screens": [
      "/images/work/conveyor-belt-health-monitoring-1.png",
      "/images/work/conveyor-belt-health-monitoring-2.png"
    ],
    "cover": {
      "src": "/images/work/conveyor-belt-card.jpg",
      "bg": "#101827",
      "ink": "light",
      "position": "center 70%"
    }
  },
  {
    "slug": "tfrenzy-product-maintenance",
    "title": "TFrenzy Product Maintenance Web App",
    "category": "Web App",
    "tags": [
      "Web App",
      "In-House"
    ],
    "origin": "TFrenzy",
    "hook": "Software vendors need one place to manage what they sell, who bought it, and their licenses.",
    "summary": "Software vendors need one place to manage what they sell, who bought it, and what they're licensed to use — this platform is that single source of truth.",
    "keyFeatures": [
      "Product and software catalog management",
      "Customer records, pricing plans, and subscription management",
      "License key generation and tracking",
      "Intuitive administrative dashboards"
    ],
    "screens": [
      "/images/work/tfrenzy-product-maintenance-1.jpg",
      "/images/work/tfrenzy-product-maintenance-2.jpg"
    ],
    "cover": {
      "src": "/images/work/tfrenzy-product-card.jpg",
      "bg": "#101827",
      "ink": "light",
      "position": "35% 55%"
    }
  },
  {
    "slug": "weighbridge-management",
    "title": "Weighbridge Management (Desktop Application)",
    "category": "Software Design",
    "tags": [
      "Software Design",
      "In-House"
    ],
    "origin": "TFrenzy",
    "hook": "Every truck that crosses a weighbridge generates a paper trail.",
    "summary": "Every truck that crosses a weighbridge generates a paper trail — this platform digitizes that entire journey, from vehicle entry to ticket to invoice.",
    "keyFeatures": [
      "Live weighbridge monitoring with automated ticket creation",
      "Vehicle recognition via ANPR (Automatic Number Plate Recognition)",
      "Corporate and fleet management, driver and material records",
      "Warehouse management and reporting",
      "User administration with role-based access control"
    ],
    "screens": [
      "/images/work/weighbridge-management-1.png",
      "/images/work/weighbridge-management-2.png"
    ],
    "cover": {
      "src": "/images/work/weighbridge-card.jpg",
      "bg": "#101827",
      "ink": "light",
      "position": "center 60%"
    }
  },
  {
    "slug": "wagon-truck-tippler",
    "title": "Wagon & Truck Tippler Web App",
    "category": "Web App",
    "tags": [
      "Web App",
      "In-House"
    ],
    "origin": "TFrenzy",
    "hook": "Tippler operations are high-risk by nature — this dashboard shrinks the hazard gap.",
    "summary": "Tippler operations are high-risk by nature — this dashboard was built to shrink the gap between a hazard occurring and a response happening.",
    "keyFeatures": [
      "Live multi-camera surveillance across tippler zones",
      "AI-powered hazard detection with instant alerts",
      "Zone-based safety tracking and machine health monitoring",
      "Operational analytics for incident response"
    ],
    "screens": [
      "/images/work/wagon-truck-tippler-1.png",
      "/images/work/wagon-truck-tippler-2.png"
    ],
    "cover": {
      "src": "/images/work/wagon-truck-tippler-card.jpg",
      "bg": "#101827",
      "ink": "light",
      "position": "45% 55%"
    }
  },
  {
    "slug": "purulia-organic-website",
    "title": "Purulia Organic Website",
    "category": "Web Design",
    "tags": [
      "Web Design",
      "In-House"
    ],
    "origin": "TFrenzy",
    "hook": "Connecting traditional paddy farmers with conscious consumers through clean organic rice commerce.",
    "summary": "Purulia Organic is an e-commerce website designed to sell authentic, chemical-free organic rice sourced directly from rural farmers in Purulia, West Bengal. The design balances warm agricultural storytelling with a streamlined shopping experience, guiding buyers from grain varieties and harvest origins to seamless checkout.",
    "keyFeatures": [
      "Curated organic rice catalog showcasing traditional, aromatic, and heirloom grain varieties",
      "Detailed product pages with nutritional facts, grain origin, and harvest authenticity",
      "Farm-to-table brand storytelling highlighting sustainable, pesticide-free farming practices",
      "Frictionless e-commerce shopping journey with quick cart access and intuitive checkout",
      "Clean, mobile-optimized responsive layout designed for effortless browsing on all devices"
    ],
    "screens": [
      "/images/work/purulia-organic-website-1.png"
    ],
    "cover": {
      "src": "/images/work/purulia-organic-card.jpg",
      "bg": "#101827",
      "ink": "light",
      "position": "center 60%"
    }
  },
  {
    "slug": "industrial-safety-monitoring",
    "title": "Industrial Safety Monitoring System (Desktop Application)",
    "category": "Software Design",
    "tags": [
      "Software Design",
      "In-House"
    ],
    "origin": "TFrenzy",
    "hook": "Compliance walkthroughs happen once a shift — this platform watches continuously.",
    "summary": "Compliance walkthroughs happen once a shift — this platform watches continuously, flagging PPE violations the moment they happen.",
    "keyFeatures": [
      "Live multi-camera monitoring with PPE violation detection",
      "Sector, employee, and group administration",
      "Real-time alerts and safety analytics",
      "Compliance reporting with role-based access control"
    ],
    "screens": [
      "/images/work/industrial-safety-monitoring-1.png",
      "/images/work/industrial-safety-monitoring-2.png"
    ],
    "cover": {
      "src": "/images/work/industrial-safety-card.jpg",
      "bg": "#101827",
      "ink": "light",
      "position": "center 60%"
    }
  }
];
