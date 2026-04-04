import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js"

// A API do marked mudou: renderer.link recebe um objeto {href, title, text}
const renderer = {
  link({ href, title, text }) {
    const isExternal = typeof href === "string" &&
      (href.startsWith("http://") || href.startsWith("https://"))
    const target    = isExternal ? ' target="_blank" rel="noopener noreferrer"' : ""
    const titleAttr = title ? ` title="${title}"` : ""
    return `<a href="${href ?? ""}"${titleAttr}${target}>${text}</a>`
  }
}

marked.use({ renderer, breaks: false, gfm: true })

export function parseMarkdown(md) {
  return marked.parse(md)
}