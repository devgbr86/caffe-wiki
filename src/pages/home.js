import { parseMarkdown } from "../marked.lib.js"

// ── Lista de artigos ────────────────────────────────────────
// Adicione novos artigos aqui. O arquivo .md deve existir em articles/<slug>.md
const posts = [
  { slug: "history",        title: "history" },
  { slug: "arabica", title: "robusta" },
  { slug: "liberica",        title: "liberica" },
  { slug: "excelsa",        title: "excelsa" },
  { slug: "species",        title: "species" },
  { slug: "varieties",        title: "varieties" },
  { slug: "processing",        title: "processing" },
  { slug: "grind_brew",        title: "grind_brew" },
  { slug: "roasting",        title: "roasting" },
  { slug: "industry",        title: "industry" },
  { slug: "brands",        title: "brands" },
  { slug: "nutrition",        title: "nutrition" },
  { slug: "glossary",        title: "glossary" },
]

// ── Cache de conteúdo ───────────────────────────────────────

const articleCache = {}

async function fetchArticle(slug) {
  if (articleCache[slug]) return articleCache[slug]
  try {
    // Caminho relativo à raiz do projeto — funciona com Live Server
    const res = await fetch(`articles/${slug}.md`)
    if (!res.ok) return null
    const text = await res.text()
    articleCache[slug] = text
    return text
  } catch {
    return null
  }
}

// ── Busca em texto completo ─────────────────────────────────

async function searchArticles(query) {
  const term = query.trim().toLowerCase()
  if (!term) return []

  const results = []

  for (const post of posts) {
    const content = await fetchArticle(post.slug)
    if (!content) continue

    const lower = content.toLowerCase()
    const index = lower.indexOf(term)

    if (index !== -1) {
      const start = Math.max(0, index - 80)
      const end   = Math.min(content.length, index + term.length + 80)
      let excerpt = content.slice(start, end).replace(/[#*`_>]/g, "").trim()
      if (start > 0)            excerpt = "…" + excerpt
      if (end < content.length) excerpt = excerpt + "…"
      results.push({ post, excerpt, index })
    }
  }

  return results
}

// ── Destaque do termo buscado ───────────────────────────────

function highlight(text, term) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return text.replace(new RegExp(`(${escaped})`, "gi"), "<mark>$1</mark>")
}

// ── Escape HTML ─────────────────────────────────────────────

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

// ── Render principal ────────────────────────────────────────
// slug: string | null — se passado, abre o artigo logo após montar a lista

export async function render(slug) {
  const app = document.getElementById("app")

  app.innerHTML = `
    <div class="articles-header">
      <h1>Artigos</h1>
    </div>

    <div class="search-bar">
      <input
        type="text"
        id="search-input"
        placeholder="🔍 Buscar nos artigos…"
        autocomplete="off"
        spellcheck="false"
      />
    </div>

    <div id="search-results" class="search-results" hidden></div>

    <ul class="post-list" id="post-list">
      ${posts.map((p) => `
        <li>
          <a href="#/articles/${p.slug}">
            <span class="post-title">${p.title}</span>
            <span class="post-slug">${p.slug}</span>
          </a>
        </li>
      `).join("")}
    </ul>

    <div id="article-view"></div>
  `

  // ── Busca com debounce ──────────────────────────────────
  const input     = document.getElementById("search-input")
  const resultsEl = document.getElementById("search-results")
  const postList  = document.getElementById("post-list")
  let debounceTimer

  input.addEventListener("input", () => {
    clearTimeout(debounceTimer)
    const query = input.value.trim()

    if (!query) {
      resultsEl.hidden    = true
      resultsEl.innerHTML = ""
      postList.hidden     = false
      return
    }

    debounceTimer = setTimeout(async () => {
      resultsEl.innerHTML = `<p class="loading">Buscando…</p>`
      resultsEl.hidden    = false
      postList.hidden     = true

      const results = await searchArticles(query)

      if (results.length === 0) {
        resultsEl.innerHTML = `
          <p class="search-empty">
            Nenhum resultado para "<strong>${escapeHtml(query)}</strong>".
          </p>`
        return
      }

      resultsEl.innerHTML = results
        .map(({ post, excerpt }) => `
          <div class="search-result-item">
            <a href="#/articles/${post.slug}" class="search-result-title">
              ${post.title}
            </a>
            <p class="search-result-excerpt">
              ${highlight(escapeHtml(excerpt), query)}
            </p>
          </div>
        `)
        .join("")
    }, 300)
  })

  // ── Abrir artigo ou mostrar placeholder ────────────────
  if (slug) {
    await loadArticle(slug)
  } else {
    document.getElementById("article-view").innerHTML = `
      <p class="article-placeholder">© Caffe Wiki</p>
    `
  }
}

// ── Carregar e renderizar artigo (exportada para o router) ──

export async function loadArticle(slug) {
  const container = document.getElementById("article-view")
  if (!container) return

  container.innerHTML = `<p class="loading">Carregando…</p>`

  const content = await fetchArticle(slug)

  if (!content) {
    container.innerHTML = `<p class="article-placeholder">Artigo não encontrado.</p>`
    return
  }

  container.innerHTML = parseMarkdown(content)
  container.scrollIntoView({ behavior: "smooth", block: "start" })
}