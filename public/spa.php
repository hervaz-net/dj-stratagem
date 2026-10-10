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
    $parentDesc = 'D&J Stratagem is one place for contractors, subcontractors, and suppliers to find construction work, win it, market the business, and keep the customer.';
    $exchangeDesc = 'The B2B supply network for construction. Manufacturers sell to distributors, distributors sell to contractors, and contractors post what the job needs, all on one marketplace.';
    $pages = [
        '/platform' => page('Platform', 'Six connected suites — bidding, subcontractor tools, marketing, Supply Exchange, business tools, and AI — replacing the patchwork of point tools contractors juggle today.', $parent),
        '/solutions' => page('Solutions', 'Workflows built for each side of the bid — general contractors, subcontractors, and suppliers, all working from one platform.', $parent),
        '/supply' => page('Supply Exchange', 'Source fasteners, lumber, conduit, PVC, plate, and power tools through sealed, scored bidding — fast enough for a same-day order, structured so suppliers stay at the table.', $parent),
        '/projects' => page('Construction Project Opportunities', 'Browse illustrative construction project cards by trade, location, and value. These are samples, not live solicitations, across Southern California trades.', $parent),
        '/pricing' => page('Pricing', 'Starter, Professional, Growth, and Enterprise plans for contractors — plus add-ons. Start on the free Starter plan, then request access to paid tiers.', $parent),
        '/about' => page('About', 'D&J Stratagem, Inc. builds the platform where contractors win work, market their business, manage relationships, and grow revenue.', $parent),
        '/contact' => page('Contact', 'Request a demo of D&J Stratagem. Tell us how your team bids, procures, and coordinates today, and we will show you where the platform fits.', $parent),
        '/changelog' => page('Changelog', 'Every release, improvement, and fix on the D&J Stratagem platform, newest first.', $parent),
        '/privacy' => page('Privacy Policy', 'How D&J Stratagem, Inc. collects, uses, and shares information on djstratageminc.com, Stratagem Exchange, and the other Stratagem services.', $parent),
        '/terms' => page('Terms and Conditions', 'Terms for the websites, applications, and services of D&J Stratagem, Inc., including Stratagem Exchange.', $parent),
        '/brand' => page('Brand guidelines', 'How to use the D&J Stratagem name, mark, and color. Printable sheet for partners and press.', $parent),
        '/login' => page('Sign in', 'Sign in to your D&J Stratagem account.', $parent, true),
        '/register' => page('Request access', 'Request a D&J Stratagem account. Accounts are approved by the team before first sign-in.', $parent, true),
        '/forgot-password' => page('Forgot password', 'Reset your D&J Stratagem password.', $parent, true),
        '/verify-email' => page('Account review', 'New D&J Stratagem accounts are approved by the team. There is no automated verification email.', $parent, true),
        '/fleet' => page('Ultra-luxury SUVs, sedans, sports cars, Sprinters, and coaches', 'Stratagem Fleet: Rolls-Royce, Maybach, Escalade ESV, Lamborghini, Sprinters, and motorcoaches across Southern California. Chauffeured or self-drive. The price is set before you ride.', 'Stratagem Fleet'),
        '/capital' => page('Get paid sooner. Bid bigger.', 'Stratagem Capital is being built to lift slow pay: working capital that follows pay apps, retainage, and materials bought months before the invoice clears. No credit is offered today.', 'Stratagem Capital'),
        '/studio' => page('Look like the firm that wins.', 'Stratagem Studio makes the brand, the site, and the proposal that make a strong construction firm look like one.', 'Stratagem Studio'),
        '/workforce' => page('The right crew, on the right day.', 'Stratagem Workforce is being built to match verified tradespeople to awarded work, so a good award never turns into a bad schedule.', 'Stratagem Workforce'),
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
    ];

    if (isset($pages[$path])) {
        return $pages[$path];
    }
    if (preg_match('#^/projects/([a-z0-9-]+)$#', $path, $m) && isset($projects[$m[1]])) {
        [$name, $where] = $projects[$m[1]];
        return page($name . ' — ' . $where, $name . ' in ' . $where . '. Illustrative sample, not a live solicitation. Dates and fit scores cannot be bid or quoted.', $parent);
    }
    if (preg_match('#^/construction-projects/([a-z0-9-]+)/([a-z0-9-]+)$#', $path, $m)) {
        $city = ucwords(str_replace('-', ' ', $m[1]));
        $trade = ucwords(str_replace('-', ' ', $m[2]));
        return page($trade . ' projects in ' . $city, 'Illustrative ' . $trade . ' project cards in ' . $city . '. Samples, not live solicitations.', $parent);
    }
    if (str_starts_with($path, '/exchange/dashboard')) {
        return page('Dashboard', 'Your Stratagem Exchange dashboard.', $exchange, true);
    }
    if (str_starts_with($path, '/dashboard')) {
        return page('Dashboard', 'Your D&J Stratagem dashboard.', $parent, true);
    }
    if (str_starts_with($path, '/exchange')) {
        return page('Stratagem Exchange', $exchangeDesc, $exchange);
    }
    return page('Page not found', "The page you're looking for has moved or no longer exists.", $parent, true);
}

function page(string $title, string $description, string $site, bool $noindex = false): array
{
    return ['title' => $title, 'description' => $description, 'site' => $site, 'noindex' => $noindex];
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
