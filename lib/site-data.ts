export type Mode = {
  slug: string;
  name: string;
  stage: "Find" | "Win" | "Build" | "Keep";
  summary: string;
  detail: string;
  headline: string;
  description: string;
  capabilities: string[];
  outcome: string;
};

export const modes: Mode[] = [
  {
    slug: "projects",
    name: "Projects",
    stage: "Find",
    summary: "Find the right work, by trade and territory.",
    detail:
      "A focused view of construction opportunities across Southern California, organized around the work your company actually does.",
    headline: "The next right job is closer than you think.",
    description:
      "Find construction projects by trade, location, and fit. Keep opportunities moving into pursuit instead of losing them in scattered alerts and spreadsheets.",
    capabilities: ["Trade- and territory-aware discovery", "Opportunity details in one view", "Save and qualify work for your team"],
    outcome: "A clearer pipeline, before the bid clock starts.",
  },
  {
    slug: "exchange",
    name: "Exchange",
    stage: "Find",
    summary: "Put buyers and suppliers on the same page.",
    detail:
      "A practical marketplace for contractors, subcontractors, distributors, and suppliers to make the first connection.",
    headline: "Good work starts with a good connection.",
    description:
      "Post a need, find the right supplier, and bring material conversations closer to the project—without jumping between disconnected channels.",
    capabilities: ["Post and manage material requests", "Discover suppliers by category", "Keep quote conversations connected"],
    outcome: "Less chasing. More useful conversations.",
  },
  {
    slug: "platform",
    name: "Platform",
    stage: "Win",
    summary: "The pursuit workspace behind every job.",
    detail:
      "A connected desk for the work between finding a lead and winning it: people, scope, follow-up, and decisions.",
    headline: "Build the pipeline, not the paperwork.",
    description:
      "Turn a promising opportunity into an organized pursuit. Keep the scope, bid, customer context, and next step together as the job moves forward.",
    capabilities: ["One pursuit workspace per opportunity", "A shared view of bids and next steps", "Context carried through the job lifecycle"],
    outcome: "A repeatable way to move from lead to award.",
  },
  {
    slug: "solutions",
    name: "Solutions",
    stage: "Win",
    summary: "A connected system for every side of the job.",
    detail:
      "A practical set of workflows for contractors, subcontractors, and suppliers—built around how construction work gets done.",
    headline: "Your work is connected. Your tools should be too.",
    description:
      "Start with the problems in front of you, then bring the right parts of the platform into the same account and workflow.",
    capabilities: ["Workflows for contractors and subs", "Supplier and distributor participation", "Tools that follow the work from bid to closeout"],
    outcome: "One operating picture, shared across the job.",
  },
  {
    slug: "supply",
    name: "Supply",
    stage: "Build",
    summary: "Source material with the job in view.",
    detail:
      "Keep sourcing connected to the scope, schedule, and supplier relationships behind each project.",
    headline: "Get the right material moving.",
    description:
      "Bring material needs and supplier conversations into the same flow as the work—so sourcing does not become a separate project of its own.",
    capabilities: ["Organize material needs by job", "Connect with local suppliers", "Keep quote activity close to the scope"],
    outcome: "More control from quote request to delivery.",
  },
  {
    slug: "capital",
    name: "Capital",
    stage: "Build",
    summary: "Plan for the cash-flow pressure of a job.",
    detail:
      "Make the financial side of taking on work easier to understand, prepare, and discuss.",
    headline: "Make room to take on the work.",
    description:
      "Use job context to organize capital needs and prepare for the conversations that help you take on the next project.",
    capabilities: ["See capital needs alongside active work", "Prepare job details for a funding conversation", "Keep planning attached to the pipeline"],
    outcome: "A more informed path from award to mobilization.",
  },
  {
    slug: "workforce",
    name: "Workforce",
    stage: "Build",
    summary: "Match crews to the work ahead.",
    detail:
      "Coordinate crew needs around the work you have won and the schedule you have to meet.",
    headline: "Put the right crew on the right job.",
    description:
      "Keep workforce planning connected to project scope, timing, and trade needs—before a staffing gap becomes a schedule problem.",
    capabilities: ["Plan crew needs by project phase", "Keep trade and availability context together", "See staffing alongside the pipeline"],
    outcome: "A better view of who the job needs, and when.",
  },
  {
    slug: "fleet",
    name: "Fleet",
    stage: "Build",
    summary: "Get vehicles where the job needs them.",
    detail:
      "Plan and reserve work vehicles around crews, job locations, and the realities of getting on site.",
    headline: "Keep your crews moving.",
    description:
      "Bring vehicle planning into the job workflow, so fleet needs are easier to see before your team rolls out.",
    capabilities: ["Plan vehicle needs by job", "Coordinate reservations around crews", "Keep trip details close to the schedule"],
    outcome: "Fewer last-minute scrambles for the road.",
  },
  {
    slug: "studio",
    name: "Studio",
    stage: "Keep",
    summary: "Turn finished work into the next opportunity.",
    detail:
      "Showcase completed projects and keep your business visible to the customers you want to reach next.",
    headline: "Make the work you finish work for you.",
    description:
      "Give completed projects a place to live beyond closeout. Build a clearer story of your work and bring the next customer into view.",
    capabilities: ["Build a portfolio from completed work", "Share project stories with customers", "Keep your company presence connected"],
    outcome: "A stronger proof point for the next pursuit.",
  },
];

export const pipeline = [
  {
    number: "01",
    title: "Find the work",
    modes: ["Projects", "Exchange"],
    text: "Relevant opportunities and material needs, surfaced by trade and territory.",
  },
  {
    number: "02",
    title: "Price & pursue",
    modes: ["Platform", "Solutions"],
    text: "Scope the opportunity, organize the bid, and keep the next action visible.",
  },
  {
    number: "03",
    title: "Build the job",
    modes: ["Supply", "Capital", "Workforce", "Fleet"],
    text: "Source, plan, staff, and move the work with the job context in one place.",
  },
  {
    number: "04",
    title: "Win what’s next",
    modes: ["Studio"],
    text: "Show the finished work and carry that proof into the next customer conversation.",
  },
];

export const resourceSections = [
  {
    slug: "blog",
    title: "Field notes",
    description: "Ideas for running a stronger construction business.",
  },
  {
    slug: "changelog",
    title: "Product updates",
    description: "A straightforward log of what is changing across the platform.",
  },
  {
    slug: "guides",
    title: "Guides",
    description: "Useful starting points for the people who keep projects moving.",
  },
];

export const faqs = [
  {
    question: "Is Starter really free?",
    answer:
      "Yes. There’s no card required to request and set up a Starter account. Every company is reviewed by a person.",
  },
  {
    question: "What does a paid plan cost?",
    answer:
      "We’ll confirm a plan’s scope and price with you before you commit. Request access and our team will talk through your workflow.",
  },
  {
    question: "Do I have to use all nine modes?",
    answer:
      "No. Start with the parts that fit your business. Talk with our team about which workflows are available for your account.",
  },
];
