import * as Home    from "./pages/home.js"
import * as Contact from "./pages/contact.js"
import * as Legal   from "./pages/legal.js"

function setActiveNav() {
  const hash = location.hash || "#/"
  document.querySelectorAll("nav a").forEach((a) => {
    const href = a.getAttribute("href")
    const isActive =
      href === hash ||
      (href !== "#/" && hash.startsWith(href))
    a.classList.toggle("active", isActive)
  })
}

export function initRouter() {
  function handleRoute() {
    const hash = location.hash || "#/"
    setActiveNav()

    // Artigo específico: #/articles/intro-web
    const articleMatch = hash.match(/#\/articles\/(.+)/)
    if (articleMatch) {
      if (!document.getElementById("article-view")) {
        Home.render(articleMatch[1])
      } else {
        Home.loadArticle(articleMatch[1])
      }
      return
    }

    // Home / lista de artigos
    if (hash === "#/" || hash === "" || hash === "#/articles") {
      Home.render(null)
      return
    }

    if (hash === "#/ebook") {
      Ebook.render()
      return
    }

    if (hash === "#/contact") {
      Contact.render()
      return
    }

    // Legal: #/legal/privacidade, #/legal/termos, #/legal/cookies
    const legalMatch = hash.match(/#\/legal\/(.+)/)
    if (legalMatch) {
      Legal.render(legalMatch[1])
      return
    }

    document.getElementById("app").innerHTML = `
      <div class="not-found">
        <span class="code">404</span>
        <p>Página não encontrada. <a href="#/">Voltar ao início.</a></p>
      </div>
    `
  }

  window.addEventListener("hashchange", handleRoute)
  handleRoute()
}