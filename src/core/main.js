// ===================================
// CAFFEWIKI — main.js
// ===================================
// Depends on: router.js (must load first, exposes window.CaffeRouter)
// ===================================

// Alias único — nunca desestrutura no topo para não redeclarar globais
var R        = window.CaffeRouter;
var SECTIONS = R.ROUTES;

// ===================================
// FETCH
// ===================================

function fetchMD(file) {
  return fetch("/articles/" + file)
    .then(function(res) {
      if (!res.ok) throw new Error("Página não encontrada");
      return res.text();
    })
    .catch(function(err) {
      console.error("Erro ao carregar " + file + ":", err);
      return "# Erro ao carregar página\n\nVerifique se o arquivo " + file + " existe na pasta /articles/";
    });
}

function extractTitle(md, fallback) {
  var m = md.match(/^#\s(.+)/m);
  return m ? m[1] : fallback;
}

// ===================================
// VIEWS
// ===================================

var listView   = document.getElementById("list-view");
var postView   = document.getElementById("post-view");
var searchView = document.getElementById("search-view");

function show(view) {
  [listView, postView, searchView].forEach(function(v) { v.style.display = "none"; });
  view.style.display = "block";
}

// ===================================
// SIDEBAR
// ===================================

var sidebarNav = document.getElementById("sidebar-nav");

function buildSidebar(activeFile) {
  sidebarNav.innerHTML = "";
  SECTIONS.forEach(function(r) {
    var li = document.createElement("li");
    var a  = document.createElement("a");
    a.href        = R.routePath(r);
    a.textContent = r.label;
    if (r.file === activeFile) a.classList.add("active");
    li.appendChild(a);
    sidebarNav.appendChild(li);
  });
}

// ===================================
// SIDEBAR MOBILE TOGGLE
// ===================================

var sidebarEl = document.getElementById("sidebar");
var toggleBtn = document.getElementById("sidebar-toggle");

toggleBtn.addEventListener("click", function() {
  sidebarEl.classList.toggle("open");
});

document.addEventListener("click", function(e) {
  if (
    sidebarEl.classList.contains("open") &&
    !sidebarEl.contains(e.target) &&
    e.target !== toggleBtn
  ) {
    sidebarEl.classList.remove("open");
  }
});

// ===================================
// BUSCA AO VIVO
// ===================================

var liveInput = document.getElementById("live-search");
var resultsEl = document.getElementById("results");

var articleData  = [];
var currentRoute = null;
var searchTimeout = null;

Promise.all(
  SECTIONS.map(function(r) {
    return fetchMD(r.file).then(function(md) {
      return { file: r.file, title: extractTitle(md, r.label), text: md.toLowerCase() };
    });
  })
).then(function(data) { articleData = data; });

liveInput.addEventListener("input", function() {
  clearTimeout(searchTimeout);
  var q = liveInput.value.trim();
  if (!q) {
    currentRoute ? show(postView) : show(listView);
    return;
  }
  searchTimeout = setTimeout(function() { doLiveSearch(q); }, 240);
});

function doLiveSearch(q) {
  show(searchView);
  var ql      = q.toLowerCase();
  var matches = articleData.filter(function(p) { return p.text.indexOf(ql) !== -1; });

  resultsEl.innerHTML = "";

  if (matches.length === 0) {
    resultsEl.innerHTML = '<li style="padding:0.6rem 0.75rem;color:#54595d;font-style:italic;font-size:13px;">Nenhum resultado encontrado.</li>';
    return;
  }

  matches.forEach(function(p) {
    var route = R.routeByFile(p.file);
    var href  = route ? R.routePath(route) : ("?file=" + encodeURIComponent(p.file));
    var li    = document.createElement("li");
    li.innerHTML = '<a href="' + href + '">' + p.title + "</a>";
    resultsEl.appendChild(li);
  });
}

// ===================================
// ROTEAMENTO
// ===================================

function renderRoute(route) {
  currentRoute = route;
  buildSidebar(route ? route.file : null);

  if (route) {
    show(postView);
    fetchMD(route.file).then(function(md) {
      document.getElementById("content").innerHTML = DOMPurify.sanitize(marked.parse(md));
      document.title = extractTitle(md, route.label) + " — CAFFEWIKI";
    });
  } else {
    show(listView);
    document.title = "CAFFEWIKI";
    var ul = document.getElementById("posts");
    Promise.all(
      SECTIONS.map(function(r) {
        return fetchMD(r.file).then(function(md) {
          return { route: r, title: extractTitle(md, r.label) };
        });
      })
    ).then(function(sections) {
      ul.innerHTML = "";
      sections.forEach(function(s) {
        var li = document.createElement("li");
        li.innerHTML = '<a href="' + R.routePath(s.route) + '">' + s.title + "</a>";
        ul.appendChild(li);
      });
    });
  }
}

// ===================================
// BOOT
// ===================================

window.addEventListener("routechange", function(e) {
  renderRoute(e.detail);
  liveInput.value = "";
});

// Aguarda DOMPurify + marked estarem prontos (carregados por src/lib/marked.js)
// Se já estiverem disponíveis (ex: carregamento síncrono legado), inicia direto.
function boot() {
  renderRoute(R.resolveCurrentRoute());
}

if (typeof marked !== "undefined" && typeof DOMPurify !== "undefined") {
  boot();
} else {
  window.addEventListener("caffewiki:libs-ready", boot, { once: true });
}