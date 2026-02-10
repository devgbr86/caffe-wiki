# CaffeWiki

Base de conhecimento estática sobre café - marcas, métodos de preparo, origens, dados técnicos e especificações.

## Sobre o Projeto

CaffeWiki é uma wiki estática desenvolvida para catalogar e documentar informações técnicas sobre café. O projeto utiliza Markdown para conteúdo e JavaScript vanilla para navegação, sem dependências de frameworks.

## Características

- **Arquitetura simples**: HTML, CSS e JavaScript vanilla
- **Conteúdo em Markdown**: Páginas escritas em .md e renderizadas com marked.js
- **Busca integrada**: Sistema de busca que indexa todo o conteúdo
- **Tags rápidas**: Botões de atalho para buscas frequentes
- **Responsivo**: Design adaptado para desktop, tablet e mobile
- **Modular**: CSS dividido em módulos (layout + markdown)

## Estrutura do Projeto

```
/
├── index.html          # Página principal
├── script.js           # Lógica de navegação e busca
├── style.css           # Imports CSS
├── layout.css          # Estilos de estrutura
├── markdown.css        # Estilos de conteúdo
├── sections/           # Arquivos markdown
│   ├── intro.md
│   ├── post2.md
│   └── ...
└── assets/
    └── img/
```

## Como Usar

1. Clone ou baixe os arquivos do projeto
2. Adicione seus arquivos .md na pasta `/sections/`
3. Edite o array `SECTIONS` no `script.js` com os nomes dos arquivos
4. Abra `index.html` em um navegador ou hospede em um servidor web

## Adicionando Conteúdo

### Criar Nova Página

1. Crie um arquivo `.md` na pasta `/sections/`
2. Adicione o caminho do arquivo no array `SECTIONS` em `script.js`:

```javascript
const SECTIONS = [
  "intro.md",
  "nova-pagina.md",  // Nova página
  // ...
];
```

### Formato do Markdown

Cada arquivo deve começar com um título H1:

```markdown
# Título da Página

Conteúdo da página...
```

## Tecnologias

- **Marked.js**: Parser de Markdown para HTML
- **DOMPurify**: Sanitização de HTML para segurança
- **JavaScript ES6**: Manipulação do DOM e fetch API
- **CSS Grid/Flexbox**: Layout responsivo

## Personalização

### Cores

As cores principais estão definidas nos arquivos CSS:
- Marrom escuro: `#3e2723`
- Marrom médio: `#8b6f47`
- Bege claro: `#f5f5dc`

### Tags Rápidas

Edite a seção `.tags-container` no `index.html` para adicionar ou remover tags de busca rápida.

## Deploy

O projeto é estático e pode ser hospedado em qualquer serviço:
- GitHub Pages
- Cloudflare Pages
- Netlify
- Vercel

## Licença

Este projeto está disponível para uso livre.