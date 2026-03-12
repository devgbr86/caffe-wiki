// ===================================
// CONFIGURAÇÃO
// ===================================
const SECTIONS = [
  { file: "history.md",    label: "História do Café" },
  { file: "species.md",    label: "Espécies" },
  { file: "arabica.md",    label: "Arábica" },
  { file: "robusta.md",    label: "Robusta" },
  { file: "liberica.md",   label: "Liberica" },
  { file: "excelsa.md",    label: "Excelsa" },
  { file: "varieties.md",  label: "Variedades" },
  { file: "processing.md", label: "Processamento" },
  { file: "roasting.md",   label: "Torra" },
  { file: "grind_brew.md", label: "Moagem e Preparo" },
  { file: "industry.md",   label: "Indústria" },
  { file: "brands.md",     label: "Marcas" },
  { file: "nutrition.md",  label: "Nutrição" },
  { file: "glossary.md",   label: "Glossário" }
];

// ===================================
// FETCH
// ===================================

async function fetchMD(file) {
  try {
    const response = await fetch(`articles/${file}`);
    if (!response.ok) throw new Error('Página não encontrada');
    return await response.text();
  } catch (error) {
    console.error(`Erro ao carregar ${file}:`, error);
    return `# Erro ao carregar página\n\nVerifique se o arquivo ${file} existe na pasta /articles/`;
  }
}

// Extrai título do markdown (primeiro h1)
function extractTitle(md, fallback) {
  return md.match(/^#\s(.+)/m)?.[1] || fallback;
}

// ===================================
// VIEWS
// ===================================

const params     = new URLSearchParams(location.search);
const file       = params.get("file");

const listView   = document.getElementById("list-view");
const postView   = document.getElementById("post-view");
const searchView = document.getElementById("search-view");

function show(view) {
  [listView, postView, searchView].forEach(v => v.style.display = "none");
  view.style.display = "block";
}

// ===================================
// SIDEBAR — build nav + active state
// ===================================

const sidebarNav = document.getElementById("sidebar-nav");

SECTIONS.forEach(s => {
  const li = document.createElement("li");
  const a  = document.createElement("a");
  a.href = `?file=${encodeURIComponent(s.file)}`;
  a.textContent = s.label;
  if (file === s.file) {
    a.classList.add("active");
  }
  li.appendChild(a);
  sidebarNav.appendChild(li);
});

// ===================================
// SIDEBAR MOBILE TOGGLE
// ===================================

const sidebarEl = document.getElementById("sidebar");
const toggleBtn = document.getElementById("sidebar-toggle");

toggleBtn.addEventListener("click", () => {
  sidebarEl.classList.toggle("open");
});

// Close sidebar when clicking outside on mobile
document.addEventListener("click", (e) => {
  if (
    sidebarEl.classList.contains("open") &&
    !sidebarEl.contains(e.target) &&
    e.target !== toggleBtn
  ) {
    sidebarEl.classList.remove("open");
  }
});

// ===================================
// BUSCA AO VIVO — campo fixo
// ===================================

const liveInput = document.getElementById("live-search");
const resultsEl = document.getElementById("results");

// Pre-carrega todos os artigos em cache
let articleData = [];

Promise.all(
  SECTIONS.map(async s => {
    const md    = await fetchMD(s.file);
    const title = extractTitle(md, s.label);
    return { file: s.file, title, text: md.toLowerCase() };
  })
).then(data => {
  articleData = data;
});

let searchTimeout = null;

liveInput.addEventListener("input", () => {
  clearTimeout(searchTimeout);
  const q = liveInput.value.trim();

  if (!q) {
    if (file) {
      show(postView);
    } else {
      show(listView);
    }
    return;
  }

  searchTimeout = setTimeout(() => doLiveSearch(q), 240);
});

function doLiveSearch(q) {
  show(searchView);

  const ql      = q.toLowerCase();
  const matches = articleData.filter(p => p.text.includes(ql));

  resultsEl.innerHTML = "";

  if (matches.length === 0) {
    resultsEl.innerHTML = '<li style="padding:0.6rem 0.75rem;color:#54595d;font-style:italic;font-size:13px;">Nenhum resultado encontrado.</li>';
    return;
  }

  matches.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="?file=${encodeURIComponent(p.file)}">${p.title}</a>`;
    resultsEl.appendChild(li);
  });
}

// ===================================
// ROTEAMENTO
// ===================================

if (file) {
  show(postView);

  fetchMD(file).then(md => {
    const html = marked.parse(md);
    document.getElementById("content").innerHTML = DOMPurify.sanitize(html);

    // Update page title
    const title = extractTitle(md, file.replace(".md", ""));
    document.title = `${title} — CAFFEINDEX`;
  });

} else {
  show(listView);

  const ul = document.getElementById("posts");

  Promise.all(
    SECTIONS.map(async s => {
      const md    = await fetchMD(s.file);
      const title = extractTitle(md, s.label);
      return { file: s.file, title };
    })
  ).then(sections => {
    ul.innerHTML = "";
    sections.forEach(p => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="?file=${encodeURIComponent(p.file)}">${p.title}</a>`;
      ul.appendChild(li);
    });
  });
}