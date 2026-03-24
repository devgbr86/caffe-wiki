// ===================================
// CAFFEWIKI — Client-Side Router
// ===================================
// Maps friendly URL slugs to article MD files.
// Uses History API (pushState) for clean URLs.
//
// URL pattern:  /wiki/<slug>
// Fallback:     /?file=<filename>  (backward compat)
// ===================================

const ROUTES = [
  { slug: "historia",          file: "history.md",    label: "História do Café" },
  { slug: "especies",          file: "species.md",    label: "Espécies" },
  { slug: "arabica",           file: "arabica.md",    label: "Arábica" },
  { slug: "robusta",           file: "robusta.md",    label: "Robusta" },
  { slug: "liberica",          file: "liberica.md",   label: "Liberica" },
  { slug: "excelsa",           file: "excelsa.md",    label: "Excelsa" },
  { slug: "variedades",        file: "varieties.md",  label: "Variedades" },
  { slug: "processamento",     file: "processing.md", label: "Processamento" },
  { slug: "torra",             file: "roasting.md",   label: "Torra" },
  { slug: "moagem-e-preparo",  file: "grind_brew.md", label: "Moagem e Preparo" },
  { slug: "industria",         file: "industry.md",   label: "Indústria" },
  { slug: "marcas",            file: "brands.md",     label: "Marcas" },
  { slug: "nutricao",          file: "nutrition.md",  label: "Nutrição" },
  { slug: "glossario",         file: "glossary.md",   label: "Glossário" },
];

// ─── Internal lookup maps ───────────────────────────────────────────────────

const _bySlug = Object.fromEntries(ROUTES.map(r => [r.slug, r]));
const _byFile = Object.fromEntries(ROUTES.map(r => [r.file, r]));

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Returns the route object for a given slug, or null.
 * @param {string} slug
 * @returns {{ slug: string, file: string, label: string } | null}
 */
function routeBySlug(slug) {
  return _bySlug[slug] ?? null;
}

/**
 * Returns the route object for a given MD filename, or null.
 * @param {string} file
 * @returns {{ slug: string, file: string, label: string } | null}
 */
function routeByFile(file) {
  return _byFile[file] ?? null;
}

/**
 * Returns the canonical URL path for a route.
 * e.g. "/wiki/arabica"
 * @param {{ slug: string }} route
 * @returns {string}
 */
function routePath(route) {
  return `/wiki/${route.slug}`;
}

// ─── Current route resolution ────────────────────────────────────────────────

/**
 * Resolves the active route from the current browser location.
 * Supports:
 *   /wiki/<slug>           → primary (clean URL)
 *   /?file=<filename>      → legacy query-string (backward compat)
 *
 * Returns the matching route object, or null if on the index.
 * @returns {{ slug: string, file: string, label: string } | null}
 */
function resolveCurrentRoute() {
  const path   = location.pathname;
  const params = new URLSearchParams(location.search);

  // Primary: /wiki/<slug>
  const wikiMatch = path.match(/^\/wiki\/([^/]+)\/?$/);
  if (wikiMatch) {
    return routeBySlug(wikiMatch[1]) ?? null;
  }

  // Legacy: ?file=arabica.md
  const legacyFile = params.get("file");
  if (legacyFile) {
    const route = routeByFile(legacyFile);
    if (route) {
      // Silently upgrade to clean URL without full reload
      history.replaceState({ file: route.file }, "", routePath(route));
    }
    return route ?? null;
  }

  return null; // index / home
}

// ─── Navigation ─────────────────────────────────────────────────────────────

/**
 * Navigates to a route by file name, updating the URL via pushState.
 * Dispatches a "routechange" event on window so main.js can react.
 * @param {string} file  e.g. "arabica.md"
 */
function navigateTo(file) {
  const route = routeByFile(file);
  if (!route) {
    console.warn(`[Router] No route found for file: ${file}`);
    return;
  }
  history.pushState({ file: route.file }, "", routePath(route));
  window.dispatchEvent(new CustomEvent("routechange", { detail: route }));
}

/**
 * Navigates back to the index (home), clearing any route.
 * Dispatches a "routechange" event with detail = null.
 */
function navigateHome() {
  history.pushState({}, "", "/");
  window.dispatchEvent(new CustomEvent("routechange", { detail: null }));
}

// Handle browser back/forward buttons
window.addEventListener("popstate", () => {
  const route = resolveCurrentRoute();
  window.dispatchEvent(new CustomEvent("routechange", { detail: route ?? null }));
});

// ─── Intercept internal <a> clicks ──────────────────────────────────────────
// Any anchor that points to /wiki/<slug> or ?file=<file> is handled
// client-side without a full page reload.

document.addEventListener("click", (e) => {
  const anchor = e.target.closest("a[href]");
  if (!anchor) return;

  const href = anchor.getAttribute("href");
  if (!href) return;

  // Skip external links
  if (anchor.target === "_blank" || href.startsWith("http") || href.startsWith("mailto:")) return;

  // Match /wiki/<slug>
  const wikiMatch = href.match(/^\/wiki\/([^/]+)\/?$/);
  if (wikiMatch) {
    const route = routeBySlug(wikiMatch[1]);
    if (route) {
      e.preventDefault();
      navigateTo(route.file);
      return;
    }
  }

  // Match ?file=<filename> (legacy links still in MD content)
  const legacyMatch = href.match(/[?&]file=([^&]+)/);
  if (legacyMatch) {
    const file = decodeURIComponent(legacyMatch[1]);
    const route = routeByFile(file);
    if (route) {
      e.preventDefault();
      navigateTo(route.file);
      return;
    }
  }

  // Match index.html or bare /
  if (href === "index.html" || href === "/" || href === "") {
    e.preventDefault();
    navigateHome();
  }
});

// ─── Public API ──────────────────────────────────────────────────────────────

window.CaffeRouter = {
  ROUTES,
  routeBySlug,
  routeByFile,
  routePath,
  resolveCurrentRoute,
  navigateTo,
  navigateHome,
};