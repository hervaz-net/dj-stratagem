"""Initial site copy, taken from the existing public pages. No invented prices."""

MODES = [
    {
        "slug": "projects",
        "name": "Projects",
        "stage": "Find",
        "summary": "Find the right work, by trade and territory.",
        "detail": "A focused view of construction opportunities across Southern California, organized around the work your company actually does.",
        "headline": "The next right job is closer than you think.",
        "description": "Find construction projects by trade, location, and fit. Keep opportunities moving into pursuit instead of losing them in scattered alerts and spreadsheets.",
        "outcome": "A clearer pipeline, before the bid clock starts.",
        "capabilities": [
            "Trade- and territory-aware discovery",
            "Opportunity details in one view",
            "Save and qualify work for your team",
        ],
    },
    {
        "slug": "exchange",
        "name": "Exchange",
        "stage": "Find",
        "summary": "Put buyers and suppliers on the same page.",
        "detail": "A practical marketplace for contractors, subcontractors, distributors, and suppliers to make the first connection.",
        "headline": "Good work starts with a good connection.",
        "description": "Post a need, find the right supplier, and bring material conversations closer to the project—without jumping between disconnected channels.",
        "outcome": "Less chasing. More useful conversations.",
        "capabilities": [
            "Post and manage material requests",
            "Discover suppliers by category",
            "Keep quote conversations connected",
        ],
    },
    {
        "slug": "platform",
        "name": "Platform",
        "stage": "Win",
        "summary": "The pursuit workspace behind every job.",
        "detail": "A connected desk for the work between finding a lead and winning it: people, scope, follow-up, and decisions.",
        "headline": "Build the pipeline, not the paperwork.",
        "description": "Turn a promising opportunity into an organized pursuit. Keep the scope, bid, customer context, and next step together as the job moves forward.",
        "outcome": "A repeatable way to move from lead to award.",
        "capabilities": [
            "One pursuit workspace per opportunity",
            "A shared view of bids and next steps",
            "Context carried through the job lifecycle",
        ],
    },
    {
        "slug": "solutions",
        "name": "Solutions",
        "stage": "Win",
        "summary": "A connected system for every side of the job.",
        "detail": "A practical set of workflows for contractors, subcontractors, and suppliers—built around how construction work gets done.",
        "headline": "Your work is connected. Your tools should be too.",
        "description": "Start with the problems in front of you, then bring the right parts of the platform into the same account and workflow.",
        "outcome": "One operating picture, shared across the job.",
        "capabilities": [
            "Workflows for contractors and subs",
            "Supplier and distributor participation",
            "Tools that follow the work from bid to closeout",
        ],
    },
    {
        "slug": "supply",
        "name": "Supply",
        "stage": "Build",
        "summary": "Source material with the job in view.",
        "detail": "Keep sourcing connected to the scope, schedule, and supplier relationships behind each project.",
        "headline": "Get the right material moving.",
        "description": "Bring material needs and supplier conversations into the same flow as the work—so sourcing does not become a separate project of its own.",
        "outcome": "More control from quote request to delivery.",
        "capabilities": [
            "Organize material needs by job",
            "Connect with local suppliers",
            "Keep quote activity close to the scope",
        ],
    },
    {
        "slug": "capital",
        "name": "Capital",
        "stage": "Build",
        "summary": "Plan for the cash-flow pressure of a job.",
        "detail": "Make the financial side of taking on work easier to understand, prepare, and discuss.",
        "headline": "Make room to take on the work.",
        "description": "Use job context to organize capital needs and prepare for the conversations that help you take on the next project.",
        "outcome": "A more informed path from award to mobilization.",
        "capabilities": [
            "See capital needs alongside active work",
            "Prepare job details for a funding conversation",
            "Keep planning attached to the pipeline",
        ],
    },
    {
        "slug": "workforce",
        "name": "Workforce",
        "stage": "Build",
        "summary": "Match crews to the work ahead.",
        "detail": "Coordinate crew needs around the work you have won and the schedule you have to meet.",
        "headline": "Put the right crew on the right job.",
        "description": "Keep workforce planning connected to project scope, timing, and trade needs—before a staffing gap becomes a schedule problem.",
        "outcome": "A better view of who the job needs, and when.",
        "capabilities": [
            "Plan crew needs by project phase",
            "Keep trade and availability context together",
            "See staffing alongside the pipeline",
        ],
    },
    {
        "slug": "fleet",
        "name": "Fleet",
        "stage": "Build",
        "summary": "Get vehicles where the job needs them.",
        "detail": "Plan and reserve work vehicles around crews, job locations, and the realities of getting on site.",
        "headline": "Keep your crews moving.",
        "description": "Bring vehicle planning into the job workflow, so fleet needs are easier to see before your team rolls out.",
        "outcome": "Fewer last-minute scrambles for the road.",
        "capabilities": [
            "Plan vehicle needs by job",
            "Coordinate reservations around crews",
            "Keep trip details close to the schedule",
        ],
    },
    {
        "slug": "studio",
        "name": "Studio",
        "stage": "Keep",
        "summary": "Turn finished work into the next opportunity.",
        "detail": "Showcase completed projects and keep your business visible to the customers you want to reach next.",
        "headline": "Make the work you finish work for you.",
        "description": "Give completed projects a place to live beyond closeout. Build a clearer story of your work and bring the next customer into view.",
        "outcome": "A stronger proof point for the next pursuit.",
        "capabilities": [
            "Build a portfolio from completed work",
            "Share project stories with customers",
            "Keep your company presence connected",
        ],
    },
]

PIPELINE = [
    {
        "number": "01",
        "title": "Find the work",
        "modes_label": "Projects, Exchange",
        "text": "Relevant opportunities and material needs, surfaced by trade and territory.",
    },
    {
        "number": "02",
        "title": "Price & pursue",
        "modes_label": "Platform, Solutions",
        "text": "Scope the opportunity, organize the bid, and keep the next action visible.",
    },
    {
        "number": "03",
        "title": "Build the job",
        "modes_label": "Supply, Capital, Workforce, Fleet",
        "text": "Source, plan, staff, and move the work with the job context in one place.",
    },
    {
        "number": "04",
        "title": "Win what’s next",
        "modes_label": "Studio",
        "text": "Show the finished work and carry that proof into the next customer conversation.",
    },
]

FAQS = [
    {
        "question": "Is Starter really free?",
        "answer": "Yes. There’s no card required to request and set up a Starter account. Every company is reviewed by a person.",
    },
    {
        "question": "What does a paid plan cost?",
        "answer": "We’ll confirm a plan’s scope and price with you before you commit. Request access and our team will talk through your workflow.",
    },
    {
        "question": "Do I have to use all nine modes?",
        "answer": "No. Start with the parts that fit your business. Talk with our team about which workflows are available for your account.",
    },
]

PLANS = [
    {
        "name": "Starter",
        "description": "Get your company on the desk.",
        "price_label": "Free",
        "qualifier": "Free to start",
        "action_label": "Join free",
        "action_url": "/join/",
        "featured": False,
        "features": [
            "Create a company profile",
            "Get started in the D&J network",
            "Explore the nine connected modes",
            "Human-reviewed account request",
        ],
    },
    {
        "name": "Professional",
        "description": "For a trade business building a steady pipeline.",
        "price_label": "Request access",
        "qualifier": "Plan reviewed with you",
        "action_label": "Request access",
        "action_url": "/contact/?topic=Professional%20access",
        "featured": True,
        "features": [
            "A guided setup for your company",
            "A workflow matched to your trade",
            "Access plan discussed before you commit",
            "Talk with a real person",
        ],
    },
    {
        "name": "Growth",
        "description": "For teams coordinating more work and people.",
        "price_label": "Request access",
        "qualifier": "Scoped for your team",
        "action_label": "Request access",
        "action_url": "/contact/?topic=Growth%20access",
        "featured": False,
        "features": [
            "A plan built around your workflow",
            "Coordinate the modes your jobs need",
            "Team and rollout conversation",
            "Clear scope before you decide",
        ],
    },
    {
        "name": "Enterprise",
        "description": "For organizations with complex operations.",
        "price_label": "Request access",
        "qualifier": "Talk to our team",
        "action_label": "Talk to our team",
        "action_url": "/contact/?topic=Enterprise%20access",
        "featured": False,
        "features": [
            "Discuss the right scope together",
            "Plan for your operating model",
            "Review onboarding and support needs",
            "Custom proposal before commitment",
        ],
    },
]

PRINCIPLES = [
    {
        "number": "01",
        "title": "Respect the work",
        "text": "Construction is a team sport. Our tools should make the work easier to coordinate, not add another layer of busywork.",
    },
    {
        "number": "02",
        "title": "Keep it connected",
        "text": "A job does not stop at the bid. We build around the full path from opportunity to delivery to the next customer.",
    },
    {
        "number": "03",
        "title": "People stay in control",
        "text": "Accounts are reviewed by a person. AI can prepare work, but humans approve before it runs.",
    },
]

SECTIONS = [
    {"slug": "blog", "title": "Field notes", "description": "Ideas for running a stronger construction business."},
    {"slug": "changelog", "title": "Product updates", "description": "A straightforward log of what is changing across the platform."},
    {"slug": "guides", "title": "Guides", "description": "Useful starting points for the people who keep projects moving."},
]

ARTICLES = [
    {
        "slug": "a-better-view-of-the-next-job",
        "section": "blog",
        "mode": "projects",
        "title": "A better view of the next job",
        "summary": "A practical pipeline starts with a clear picture of the opportunity, the people, and what needs to happen next.",
        "intro": "A useful pipeline is more than a list of leads. It gives the team a shared view of the opportunity, who is involved, and what needs to happen next.",
        "paragraphs": [
            "Construction work moves through a series of handoffs. A lead becomes a pursuit. A pursuit turns into a bid. An award becomes a schedule, a materials plan, and a crew plan. When each step lives in a separate place, the context has to be rebuilt every time.",
            "A connected workspace keeps the basics close: the scope, the important dates, the people involved, and the next action. That does not replace judgment. It gives the people doing the work a better starting point.",
            "Start with the parts your team needs most. Keep the opportunity connected as it moves. The goal is not more process; it is less time spent reconstructing the process.",
        ],
    },
    {
        "slug": "keep-the-supply-conversation-close",
        "section": "blog",
        "mode": "supply",
        "title": "Keep the supply conversation close",
        "summary": "Material sourcing works better when requests and quotes stay connected to the project that needs them.",
        "intro": "Sourcing gets harder when a material request loses the job context that explains why it matters and when it is needed.",
        "paragraphs": [
            "A quote is useful when it reflects the scope, quantities, timing, and constraints of a real job. If those details are scattered across messages and attachments, suppliers and contractors spend time asking for context instead of working through the request.",
            "Keeping the request alongside the project helps both sides work from the same starting point. It also makes it easier to compare responses and keep the next action visible.",
            "The simple rule: connect a material conversation to the job that needs it, and keep the people responsible for the decision in the loop.",
        ],
    },
    {
        "slug": "one-job-one-shared-context",
        "section": "blog",
        "mode": "platform",
        "title": "One job. One shared context.",
        "summary": "Every handoff has a cost. Keeping the job’s context together helps a team spend more time on the work.",
        "intro": "The job is the common thread between the bid, the crew, the material, and the customer. Your tools should keep that thread intact.",
        "paragraphs": [
            "Every handoff has a context cost. A team has to re-explain the scope, locate the latest version, and work out who owns the next step. That cost compounds when every stage uses a different tool.",
            "A shared job context does not mean every person sees every detail. It means the work can carry its important information forward to the next person without being restarted from scratch.",
            "Give the job one clear home. Keep the next step visible. Let each person do their part with enough context to move confidently.",
        ],
    },
]

UPDATES = [
    {
        "label": "Platform foundation",
        "title": "Nine modes, one connected desk",
        "text": "The public platform is organized around the complete job lifecycle: find work, pursue it, build it, and keep the customer.",
    },
    {
        "label": "Account access",
        "title": "A person reviews every account",
        "text": "New company requests are reviewed by the D&J team before an account joins the network.",
    },
    {
        "label": "AI workflow",
        "title": "Human approval stays in the loop",
        "text": "AI subagents can prepare work across the pipeline. A person approves before any run is executed.",
    },
]

GUIDES = [
    {
        "title": "Get your company ready",
        "text": "A simple checklist for the company details and trade information that help your profile make sense to the network.",
        "tags": "Company profile, Trades, Territory",
    },
    {
        "title": "Build a job pipeline",
        "text": "A practical way to keep opportunities, bid dates, and follow-up steps visible to the people doing the work.",
        "tags": "Find work, Pursuits, Follow-up",
    },
    {
        "title": "Plan the handoff",
        "text": "Keep sourcing, crew, and vehicle needs connected to the scope and schedule behind a project.",
        "tags": "Materials, Crews, Fleet",
    },
]

PHOTOS = [
    {
        "src": "public/media/jobsite/site.jpg",
        "kind": "jobsite",
        "alt": "A crew in hard hats looking over a deck with conduit laid out behind them",
        "caption": "Jobsite photograph",
        "credit": "Unsplash. Names are listed in public/media/jobsite/CREDITS.txt.",
        "featured": True,
    },
    {
        "src": "public/media/jobsite/hardhat.jpg",
        "kind": "jobsite",
        "alt": "A crew in red hard hats working a rebar column and cage",
        "caption": "Jobsite photograph",
        "credit": "Unsplash. Names are listed in public/media/jobsite/CREDITS.txt.",
        "featured": False,
    },
    {
        "src": "public/media/jobsite/plans.jpg",
        "kind": "jobsite",
        "alt": "A person marking up a rolled set of construction drawings",
        "caption": "Jobsite photograph",
        "credit": "Unsplash. Names are listed in public/media/jobsite/CREDITS.txt.",
        "featured": False,
    },
    {
        "src": "public/media/construction-site.jpg",
        "kind": "jobsite",
        "alt": "Two workers in orange vests on a rebar deck beside a cutoff saw",
        "caption": "Jobsite photograph",
        "credit": "Unsplash",
        "featured": False,
    },
    {
        "src": "public/media/vehicles/ram.webp",
        "kind": "vehicle",
        "alt": "White Ram 2500 crew-cab pickup",
        "caption": "Vehicle reference",
        "credit": "Reference photograph supplied with the site. Not a counted fleet.",
        "featured": False,
    },
    {
        "src": "public/media/vehicles/silverado.webp",
        "kind": "vehicle",
        "alt": "White Chevrolet Silverado crew-cab pickup",
        "caption": "Vehicle reference",
        "credit": "Reference photograph supplied with the site. Not a counted fleet.",
        "featured": False,
    },
    {
        "src": "public/media/vehicles/sprinter.webp",
        "kind": "vehicle",
        "alt": "White Mercedes-Benz Sprinter passenger van",
        "caption": "Vehicle reference",
        "credit": "Reference photograph supplied with the site. Not a counted fleet.",
        "featured": False,
    },
    {
        "src": "public/media/vehicles/escalade.webp",
        "kind": "vehicle",
        "alt": "White Cadillac Escalade SUV",
        "caption": "Vehicle reference",
        "credit": "Reference photograph supplied with the site. Not a counted fleet.",
        "featured": False,
    },
    {
        "src": "public/media/vehicles/suburban.webp",
        "kind": "vehicle",
        "alt": "White Chevrolet Suburban SUV",
        "caption": "Vehicle reference",
        "credit": "Reference photograph supplied with the site. Not a counted fleet.",
        "featured": False,
    },
]
