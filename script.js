// ===================================
// CONFIGURAÇÃO
// ===================================
const SECTIONS = [
  "history.md",
  "species.md",
  "arabica.md",
  "robusta.md",
  "liberica.md",
  "excelsa.md",
  "varieties.md",
  "processing.md",
  "roasting.md",
  "grind_brew.md",
  "industry.md",
  "brands.md",
  "nutrition.md",
  "glossary.md"
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
// BUSCA AO VIVO — campo fixo
// ===================================

const liveInput  = document.getElementById("live-search");
const resultsEl  = document.getElementById("results");

// Pre-carrega todos os artigos em cache
let articleData = [];

Promise.all(
  SECTIONS.map(async f => {
    const md    = await fetchMD(f);
    const title = md.match(/^#\s(.+)/m)?.[1] || f.replace('.md', '');
    return { file: f, title, text: md.toLowerCase() };
  })
).then(data => {
  articleData = data;
});

let searchTimeout = null;

liveInput.addEventListener("input", () => {
  clearTimeout(searchTimeout);
  const q = liveInput.value.trim();

  if (!q) {
    // Voltar à lista ou ao artigo aberto
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
    resultsEl.innerHTML = '<li style="padding:1rem 1.75rem;color:var(--subtle);font-style:italic;">Nenhum resultado encontrado.</li>';
    return;
  }

  matches.forEach(p => {
    const li  = document.createElement('li');
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
  });

} else {
  show(listView);

  const ul = document.getElementById("posts");

  Promise.all(
    SECTIONS.map(async f => {
      const md    = await fetchMD(f);
      const title = md.match(/^#\s(.+)/m)?.[1] || f.replace('.md', '');
      return { file: f, title };
    })
  ).then(sections => {
    ul.innerHTML = "";
    sections.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="?file=${encodeURIComponent(p.file)}">${p.title}</a>`;
      ul.appendChild(li);
    });
  });
}