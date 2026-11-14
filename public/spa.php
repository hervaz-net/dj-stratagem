<?php
/**
 * SPA shell with route meta written before JavaScript runs.
 *
 * index.html is the homepage card. Every other client route used to reuse
 * that title, description, canonical, and Twitter text, so Slack, iMessage,
 * and other non-JS crawlers shared the parent homepage. This script serves
 * the same shell and stamps the route first. The React Seo components still
 * update the head after hydration.
 */
declare(strict_types=1);

$site = 'https://djstratageminc.com';
$parent = 'D&J Stratagem, Inc.';
$exchange = 'Stratagem Exchange';
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$path = '/' . trim($path, '/');
if ($path !== '/') {
    $path = rtrim($path, '/');
}

// Reset emails point at /reset-password?token=… on the parent site. The
// Exchange route used to send people to forgot-password and drop the token.
if ($path === '/exchange/reset-password') {
    redirect_to('/reset-password', 302);
}

// Exchange aliases are client redirects. Root .htaccess does not match
// /exchange/about-us and the rest, so they must leave here as redirects
// rather than the unknown-path 404.
$exchangeAlias = exchange_alias($path);
if ($exchangeAlias !== null) {
    redirect_to($exchangeAlias, 301);
}

$htmlFile = __DIR__ . '/index.html';
$html = is_readable($htmlFile) ? file_get_contents($htmlFile) : false;
if ($html === false) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo "index missing\n";
    exit;
}

$projects = [
    'downtown-medical-office-renovation' => ['Downtown Medical Office Renovation', 'Los Angeles, CA'],
    'commercial-hvac-upgrade-la' => ['Commercial HVAC Upgrade', 'Los Angeles, CA'],
    'municipal-facility-renovation-riverside' => ['Municipal Facility Renovation', 'Riverside, CA'],
    'school-modernization-anaheim' => ['School Modernization — Electrical Package', 'Anaheim, CA'],
    'harbor-logistics-hub-framing' => ['Harbor Logistics Hub — Framing', 'Long Beach, CA'],
    'civic-center-roof-replacement-pasadena' => ['Civic Center Roof Replacement', 'Pasadena, CA'],
    'inland-distribution-slab-sb' => ['Inland Distribution Center — Slab & Site Concrete', 'San Bernardino, CA'],
    'senior-housing-plumbing-riverside' => ['Senior Housing — Plumbing Package', 'Riverside, CA'],
];

$page = meta_for($path, $projects, $parent, $exchange);
if (!empty($page['status']) && (int) $page['status'] !== 200) {
    http_response_code((int) $page['status']);
}
$url = $site . $path;
$title = $page['title'];
$description = $page['description'];
$siteName = $page['site'];
$fullTitle = str_contains($title, '|') ? $title : $title . ' | ' . $siteName;

$html = replace_tag($html, 'title', $fullTitle);
$html = replace_meta($html, 'name', 'description', $description);
$html = replace_meta($html, 'property', 'og:title', $fullTitle);
$html = replace_meta($html, 'property', 'og:description', $description);
$html = replace_meta($html, 'property', 'og:url', $url);
$html = replace_meta($html, 'property', 'og:site_name', $siteName);
$html = replace_meta($html, 'name', 'twitter:title', $fullTitle);
$html = replace_meta($html, 'name', 'twitter:description', $description);
$html = replace_meta($html, 'name', 'twitter:url', $url);
$html = replace_attr($html, 'link', 'rel', 'canonical', 'href', $url);
if (!empty($page['noindex'])) {
    $html = replace_meta($html, 'name', 'robots', 'noindex, nofollow');
}

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate');
echo $html;

function meta_for(string $path, array $projects, string $parent, string $exchange): array
{
    $pages = [
        '/platform' => page('Platform', 'Six connected suites — bidding, subcontractor tools, marketing, Supply Exchange, business tools, and AI — replacing the patchwork of point tools contractors juggle today.', $parent),
        '/solutions' => page('Solutions', 'Workflows built for each side of the bid — general contractors, subcontractors, and suppliers, all working from one platform.', $parent),
        '/supply' => page('Supply Exchange', 'Source fasteners, lumber, conduit, PVC, plate, and power tools through sealed, scored bidding — fast enough for a same-day order, structured so suppliers stay at the table.', $parent),
        '/projects' => page('Construction Project Opportunities', 'Browse illustrative construction project cards by trade, location, and value. These are samples, not live solicitations, across Southern California trades.', $parent),
        '/pricing' => page('Pricing', 'Starter, Professional, Growth, and Enterprise plans for contractors — plus add-ons. Start on the free Starter plan, then request access to paid tiers.', $parent),
        '/about' => page('About', 'D&J Stratagem, Inc. builds the platform where contractors win work, market their business, manage relationships, and grow revenue.', $parent),
        '/contact' => page('Contact', 'Request a demo of D&J Stratagem. Tell us how your team bids, procures, and coordinates today, and we will show you where the platform fits.', $parent),
        '/resources' => page('Help center', 'Answers on bidding, projects, Supply Exchange, accounts, and pricing, plus ways to reach the D&J Stratagem team.', $parent),
        '/changelog' => page('Changelog', 'Every release, improvement, and fix on the D&J Stratagem platform, newest first.', $parent),
        '/privacy' => page('Privacy Policy', 'How D&J Stratagem, Inc. collects, uses, and shares information on djstratageminc.com, Stratagem Exchange, and the other Stratagem services.', $parent),
        '/terms' => page('Terms and Conditions', 'Terms for the websites, applications, and services of D&J Stratagem, Inc., including Stratagem Exchange.', $parent),
        '/brand' => page('Brand guidelines', 'How to use the D&J Stratagem name, mark, and color. Printable sheet for partners and press.', $parent),
        '/login' => page('Sign in', 'Sign in to your D&J Stratagem account.', $parent, true),
        '/register' => page('Request access', 'Request a D&J Stratagem account. Accounts are approved by the team before first sign-in.', $parent, true),
        '/forgot-password' => page('Forgot password', 'Reset your D&J Stratagem password.', $parent, true),
        '/reset-password' => page('Choose a new password', 'Set a new password for your D&J Stratagem account.', $parent, true),
        '/verify-email' => page('Account review', 'New D&J Stratagem accounts are approved by the team. There is no automated verification email.', $parent, true),
        '/fleet' => page('Pickups, Sprinters, and SUVs for the job', 'Fleet is the Stratagem AI subagent that plans and reserves work vehicles for your jobs: heavy-duty pickups, Sprinter and Transit vans, and full-size SUVs across Southern California.', 'Stratagem Fleet'),
        '/capital' => page('Get paid sooner. Bid bigger.', 'Stratagem Capital is being built to lift slow pay: working capital that follows pay apps, retainage, and materials bought months before the invoice clears. No credit is offered today.', 'Stratagem Capital'),
        '/studio' => page('Look like the firm that wins.', 'Stratagem Studio makes the brand, the site, and the proposal that make a strong construction firm look like one.', 'Stratagem Studio'),
        '/workforce' => page('The right crew, on the right day.', 'Stratagem Workforce is being built to match tradespeople to awarded work. It does not place crews today, and it does not verify licenses or certifications yet.', 'Stratagem Workforce'),
        '/exchange' => page('B2B supply marketplace for construction', 'Stratagem Exchange connects manufacturers, distributors, and contractors. Post requests for quote, list products and price sheets, compare quotes, and track orders to the jobsite.', $exchange),
        '/exchange/pricing' => page('Pricing', 'Flat plans for contractors, distributors, and manufacturers: a free Starter plan, Professional at $99/mo, Growth at $249/mo, and Enterprise. No commission on orders.', $exchange),
        '/exchange/marketplace' => page('Marketplace', 'Browse construction supply from manufacturers and distributors: power tools, fasteners, electrical, lumber, rebar and structural, PVC and fittings. Compare price, minimums, lead time, and delivery or will-call.', $exchange),
        '/exchange/contractors' => page('For contractors', 'Post a request for quote per job, compare quotes from distributors and manufacturers line by line, choose jobsite delivery or will-call, and reorder what you buy every week.', $exchange),
        '/exchange/distributors' => page('For distributors', 'List price sheets, answer contractor requests, and sell to the jobsite without a commission on the order.', $exchange),
        '/exchange/suppliers' => page('For manufacturers', 'Put your catalog in front of distributors and contractors. Buyers compare lead time, minimums, and delivery before they ask for a quote.', $exchange),
        '/exchange/contact' => page('Contact', 'Talk to Stratagem Exchange about listing products or posting what the job needs.', $exchange),
        '/exchange/about' => page('About', 'Stratagem Exchange is the B2B supply network for construction, a D&J Stratagem company.', $exchange),
        '/exchange/platform' => page('Platform', 'Requests, quotes, catalogs, and orders on one construction supply desk.', $exchange),
        '/exchange/login' => page('Sign in', 'Sign in to your Stratagem Exchange account.', $exchange, true),
        '/exchange/register' => page('Request access', 'Request a Stratagem Exchange account. Accounts are approved before first sign-in.', $exchange, true),
        '/exchange/forgot-password' => page('Forgot password', 'Reset your Stratagem Exchange password.', $exchange, true),
        '/exchange/privacy' => page('Privacy Policy', 'How Stratagem Exchange collects, uses, and shares information. Stratagem Exchange is a D&J Stratagem company.', $exchange),
        '/exchange/terms' => page('Terms and Conditions', 'Terms for Stratagem Exchange, a D&J Stratagem company.', $exchange),
        '/exchange/brand' => page('Brand guidelines', 'How to use the Stratagem Exchange name and mark. Printable sheet for partners and press.', $exchange),
        '/exchange/changelog' => page('Changelog', 'Releases and fixes for Stratagem Exchange, newest first.', $exchange),
        '/exchange/solutions' => page('Solutions', 'Workflows for contractors, distributors, and manufacturers on Stratagem Exchange.', $exchange),
        '/exchange/projects' => page('Projects', 'Illustrative construction supply requests on Stratagem Exchange. Samples, not live solicitations.', $exchange),
        '/exchange/fleet' => page('Equipment & fleet', 'Preview of equipment listings on the marketplace: mixers, excavators, trucks, generators, and scaffolding from rental yards, distributors, and contractors. Sample listings only.', $exchange),
        '/exchange/verify-email' => page('Account review', 'New Stratagem Exchange accounts are approved by the team. There is no automated verification email.', $exchange, true),
        '/marketing/fleet-cards' => page('Fleet cards', 'Printable fleet card sheet for Stratagem Fleet vehicles.', $parent),
        '/marketing/receipts' => page('Receipts', 'Receipt layout sheet for Stratagem Fleet and Stratagem Exchange.', $parent),
        '/marketing/signage' => page('Signage', 'Signage sheet for D&J Stratagem field and office use.', $parent),
        '/exchange/marketing/fleet-cards' => page('Fleet cards', 'Design concept for Stratagem Exchange fleet cards: card faces, controls layout, and a sample statement.', $exchange),
        '/exchange/marketing/receipts' => page('Receipts', 'Thermal and emailed receipt templates in the Stratagem Exchange brand.', $exchange),
        '/exchange/marketing/signage' => page('Signage', 'Exhibit banner, will-call counter sign, and vehicle panel templates for Stratagem Exchange.', $exchange),
    ];

    if (isset($pages[$path])) {
        return $pages[$path];
    }
    if (preg_match('#^/projects/([a-z0-9-]+)$#', $path, $m) && isset($projects[$m[1]])) {
        [$name, $where] = $projects[$m[1]];
        return page($name . ' — ' . $where, $name . ' in ' . $where . '. Illustrative sample, not a live solicitation. Dates and fit scores cannot be bid or quoted.', $parent);
    }
    if (preg_match('#^/exchange/projects/([a-z0-9-]+)$#', $path, $m) && isset($projects[$m[1]])) {
        [$name, $where] = $projects[$m[1]];
        return page($name . ' — ' . $where, $name . ' in ' . $where . '. Illustrative sample on Stratagem Exchange, not a live solicitation.', $exchange);
    }
    if (preg_match('#^/(?:exchange/)?construction-projects/([a-z0-9-]+)/([a-z0-9-]+)$#', $path, $m)) {
        $city = ucwords(str_replace('-', ' ', $m[1]));
        $trade = trade_label($m[2]);
        $siteName = str_starts_with($path, '/exchange/') ? $exchange : $parent;
        return page($trade . ' projects in ' . $city, 'Illustrative ' . $trade . ' project cards in ' . $city . '. Samples, not live solicitations.', $siteName);
    }
    if (preg_match('#^/(fleet|capital|studio|workforce)/(signup|signin|account)$#', $path, $m)) {
        $names = [
            'fleet' => 'Stratagem Fleet',
            'capital' => 'Stratagem Capital',
            'studio' => 'Stratagem Studio',
            'workforce' => 'Stratagem Workforce',
        ];
        $titles = [
            'signup' => 'Create an account',
            'signin' => 'Sign in',
            'account' => 'Your account',
        ];
        $descs = [
            'signup' => 'Create a ' . $names[$m[1]] . ' account.',
            'signin' => 'Sign in to your ' . $names[$m[1]] . ' account.',
            'account' => 'Your ' . $names[$m[1]] . ' account.',
        ];
        return page($titles[$m[2]], $descs[$m[2]], $names[$m[1]], true);
    }
    if ($path === '/admin' || str_starts_with($path, '/admin/')) {
        return page('Admin', 'D&J Stratagem admin.', $parent, true);
    }
    if (str_starts_with($path, '/exchange/dashboard')) {
        return page('Dashboard', 'Your Stratagem Exchange dashboard.', $exchange, true);
    }
    if (str_starts_with($path, '/dashboard')) {
        return page('Dashboard', 'Your D&J Stratagem dashboard.', $parent, true);
    }
    if ($path === '/services') {
        return page('Services', 'DJ Stratagem is one desk. Send a pursuit, a materials list, a vehicle request, a crew request, a capital request, or a studio brief.', $parent);
    }
    $modes = [
        'projects' => page('Projects', 'Send the trade, the city, and the scope. A person reads the pursuit and replies.', $parent),
        'exchange' => page('Exchange', 'Post what the job needs, or list what you sell. A person routes the request.', $parent),
        'platform' => page('Platform', 'Six suites in one workspace. Send the pursuit and a person keeps bids, documents, and follow-up on the account.', $parent),
        'solutions' => page('Solutions', 'The same desk for general contractors, subcontractors, and suppliers. Send which side you are on.', $parent),
        'supply' => page('Supply', 'Send the material list. Quotes come back sealed and scored on the weights you set.', $parent),
        'capital' => page('Capital', 'Send the pay-app, materials, or bonding need. A person reviews it and replies. The form does not fund the job.', $parent),
        'workforce' => page('Workforce', 'Send the trade, the dates, and the site. A person matches the request and replies.', $parent),
        'fleet' => page('Fleet', 'Send the vehicle and the dates for a job in Southern California. A person confirms.', $parent),
        'studio' => page('Studio', 'Send a brand, site, or proposal brief. A person replies with how the work starts.', $parent),
    ];
    if ($path === '/command' || $path === '/command/projects') {
        return $modes['projects'];
    }
    if (preg_match('#^/command/(projects|exchange|platform|solutions|supply|capital|workforce|fleet|studio)$#', $path, $m)) {
        return $modes[$m[1]];
    }
    if (preg_match('#^/command/projects/([a-z0-9-]+)$#', $path, $m) && isset($projects[$m[1]])) {
        [$name, $where] = $projects[$m[1]];
        return page('Send a pursuit in ' . $where, 'Send the trade, the city, and the scope. A person replies.', $parent);
    }
    if (preg_match('#^/command/projects/markets/([a-z0-9-]+)/([a-z0-9-]+)$#', $path, $m)) {
        $city = ucwords(str_replace('-', ' ', $m[1]));
        $trade = trade_label($m[2]);
        return page($trade . ' work in ' . $city, 'Send a ' . strtolower($trade) . ' pursuit in ' . $city . '. A person replies.', $parent);
    }
    if (str_starts_with($path, '/exchange')) {
        return page('Page not found', "The page you're looking for has moved or no longer exists.", $exchange, true, 404);
    }
    return page('Page not found', "The page you're looking for has moved or no longer exists.", $parent, true, 404);
}

/**
 * Registered Exchange <Navigate> targets. Keys are the public path.
 * Returns null for real pages, including /exchange/suppliers.
 */
function exchange_alias(string $path): ?string
{
    $map = [
        '/exchange/supply' => '/exchange/marketplace',
        '/exchange/supply/catalog' => '/exchange/marketplace',
        '/exchange/catalog' => '/exchange/marketplace',
        '/exchange/supplier' => '/exchange/suppliers',
        '/exchange/contractor' => '/exchange/contractors',
        '/exchange/distributor' => '/exchange/distributors',
        '/exchange/project' => '/exchange/projects',
        '/exchange/about-us' => '/exchange/about',
        '/exchange/contact-us' => '/exchange/contact',
        '/exchange/signin' => '/exchange/login',
        '/exchange/sign-in' => '/exchange/login',
        '/exchange/log-in' => '/exchange/login',
        '/exchange/account' => '/exchange/login',
        '/exchange/signup' => '/exchange/register',
        '/exchange/sign-up' => '/exchange/register',
        '/exchange/trial' => '/exchange/register',
        '/exchange/start' => '/exchange/register',
        '/exchange/get-started' => '/exchange/register',
        '/exchange/join' => '/exchange/register',
        '/exchange/credit' => '/exchange/dashboard/settings',
        '/exchange/credits' => '/exchange/dashboard/settings',
        '/exchange/credit-application' => '/exchange/dashboard/settings',
        '/exchange/admin' => '/exchange/dashboard/admin',
        '/exchange/forgot' => '/exchange/forgot-password',
        '/exchange/reset' => '/exchange/forgot-password',
        '/exchange/password' => '/exchange/forgot-password',
        '/exchange/blog' => '/exchange/changelog',
        '/exchange/privacy-policy' => '/exchange/privacy',
        '/exchange/terms-of-service' => '/exchange/terms',
        '/exchange/tos' => '/exchange/terms',
        '/exchange/legal' => '/exchange/terms',
        '/exchange/eula' => '/exchange/terms',
        '/exchange/unsubscribe' => '/exchange/privacy',
        '/exchange/brand-guidelines' => '/exchange/brand',
        '/exchange/equipment' => '/exchange/fleet',
        '/exchange/fleet-cards' => '/exchange/marketing/fleet-cards',
        '/exchange/receipts' => '/exchange/marketing/receipts',
        '/exchange/signage' => '/exchange/marketing/signage',
        '/exchange/home' => '/exchange',
        '/exchange/exchange' => '/exchange/marketplace',
        '/exchange/shop' => '/exchange/marketplace',
        '/exchange/features' => '/exchange/platform',
        '/exchange/product' => '/exchange/platform',
        '/exchange/services' => '/exchange/platform',
        '/exchange/how-it-works' => '/exchange/platform',
        '/exchange/howitworks' => '/exchange/platform',
        '/exchange/docs' => '/exchange/changelog',
        '/exchange/help' => '/exchange/contact',
        '/exchange/support' => '/exchange/contact',
        '/exchange/demo' => '/exchange/contact',
        '/exchange/faq' => '/exchange/contact',
        '/exchange/faqs' => '/exchange/contact',
        '/exchange/book' => '/exchange/contact',
        '/exchange/book-demo' => '/exchange/contact',
        '/exchange/request-demo' => '/exchange/contact',
        '/exchange/company' => '/exchange/about',
        '/exchange/team' => '/exchange/about',
        '/exchange/news' => '/exchange/changelog',
        '/exchange/press' => '/exchange/changelog',
        '/exchange/careers' => '/exchange/contact',
        '/exchange/jobs' => '/exchange/contact',
        '/exchange/cookies' => '/exchange/privacy',
        '/exchange/cookie' => '/exchange/privacy',
        '/exchange/cookie-policy' => '/exchange/privacy',
        '/exchange/gdpr' => '/exchange/privacy',
        '/exchange/status' => '/exchange/about',
        '/exchange/security' => '/exchange/about',
        '/exchange/investors' => '/exchange/about',
        '/exchange/partners' => '/exchange/solutions',
        '/exchange/accessibility' => '/exchange/about',
        '/exchange/a11y' => '/exchange/about',
    ];
    if (isset($map[$path])) {
        return $map[$path];
    }
    if (preg_match('#^/exchange/blog/.+#', $path) === 1) {
        return '/exchange/changelog';
    }
    return null;
}

function redirect_to(string $target, int $status): void
{
    $qs = $_SERVER['QUERY_STRING'] ?? '';
    header('Location: ' . $target . ($qs !== '' ? '?' . $qs : ''), true, $status);
    header('Cache-Control: no-cache, must-revalidate');
    exit;
}

/** "hvac" must stay HVAC. ucwords() turns the slug into "Hvac". */
function trade_label(string $slug): string
{
    $acronyms = ['hvac' => 'HVAC', 'pvc' => 'PVC'];
    $words = [];
    foreach (explode('-', $slug) as $part) {
        $words[] = $acronyms[$part] ?? ucfirst($part);
    }
    return implode(' ', $words);
}

function page(string $title, string $description, string $site, bool $noindex = false, int $status = 200): array
{
    return ['title' => $title, 'description' => $description, 'site' => $site, 'noindex' => $noindex, 'status' => $status];
}

function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

function replace_tag(string $html, string $tag, string $value): string
{
    $next = '<' . $tag . '>' . e($value) . '</' . $tag . '>';
    $out = preg_replace('#<' . $tag . '>.*?</' . $tag . '>#s', $next, $html, 1, $count);
    return $count ? $out : $html;
}

function replace_meta(string $html, string $attr, string $name, string $value): string
{
    $quoted = preg_quote($name, '#');
    $pattern = '#<meta\\s+' . $attr . '="' . $quoted . '"\\s+content="[^"]*"\\s*/?>#i';
    $next = '<meta ' . $attr . '="' . e($name) . '" content="' . e($value) . '" />';
    $out = preg_replace($pattern, $next, $html, 1, $count);
    if ($count) {
        return $out;
    }
    return str_replace('</head>', '    ' . $next . "\n  </head>", $html);
}

function replace_attr(string $html, string $tag, string $findAttr, string $findValue, string $setAttr, string $value): string
{
    $pattern = '#<' . $tag . '\\s+' . $findAttr . '="' . preg_quote($findValue, '#') . '"\\s+' . $setAttr . '="[^"]*"\\s*/?>#i';
    $next = '<' . $tag . ' ' . $findAttr . '="' . e($findValue) . '" ' . $setAttr . '="' . e($value) . '" />';
    $out = preg_replace($pattern, $next, $html, 1, $count);
    if ($count) {
        return $out;
    }
    return str_replace('</head>', '    ' . $next . "\n  </head>", $html);
}
