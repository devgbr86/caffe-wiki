const pages = {
  "privacidade": {
    title: "Política de Privacidade",
    content: `
      <h1>Política de Privacidade</h1>

      <p>Esta política descreve como as informações dos visitantes deste site são tratadas.</p>

      <h2>Dados coletados</h2>
      <p>
        Este site não coleta dados pessoais de forma ativa. Não há cadastro,
        login ou formulários que solicitem informações identificáveis.
      </p>
      <p>
        Ao entrar em contato via e-mail ou WhatsApp, as informações fornecidas
        — nome e mensagem — são usadas exclusivamente para responder ao contato.
        Não são compartilhadas com terceiros.
      </p>

      <h2>Cookies</h2>
      <p>
        Este site não utiliza cookies próprios para rastreamento ou análise.
        Consulte a <a href="#/legal/cookies">Política de Cookies</a> para mais detalhes.
      </p>

      <h2>Serviços de terceiros</h2>
      <p>
        Este site utiliza fontes do Google Fonts, carregadas externamente.
        O Google pode registrar a requisição de acordo com sua própria política de privacidade.
      </p>

      <h2>Alterações</h2>
      <p>
        Esta política pode ser atualizada a qualquer momento. A versão vigente
        é sempre a disponível nesta página.
      </p>

      <h2>Contato</h2>
      <p>
        Dúvidas sobre privacidade podem ser enviadas para
        <a href="mailto:topverbs@gmail.com">topverbs@gmail.com</a>.
      </p>
    `
  },

  "termos": {
    title: "Termos de Uso",
    content: `
      <h1>Termos de Uso</h1>

      <p>
        Ao acessar este site, você concorda com os termos descritos abaixo.
        Caso não concorde, por favor não utilize o conteúdo disponibilizado aqui.
      </p>

      <h2>Uso do conteúdo</h2>
      <p>
        Os artigos e materiais publicados neste site são de autoria própria
        e protegidos por direitos autorais. É permitida a leitura e o compartilhamento
        com atribuição ao autor. Reprodução integral sem autorização não é permitida.
      </p>

      <h2>Ebook</h2>
      <p>
        O ebook <em>Frontend Blueprint</em> é um produto digital vendido para uso pessoal.
        A compra não autoriza redistribuição, revenda ou compartilhamento do arquivo.
      </p>

      <h2>Isenção de responsabilidade</h2>
      <p>
        O conteúdo publicado tem finalidade educacional e informativa.
        O autor não se responsabiliza por decisões técnicas tomadas com base
        nos materiais disponibilizados.
      </p>

      <h2>Links externos</h2>
      <p>
        Este site pode conter links para recursos externos. O autor não tem
        controle sobre o conteúdo de terceiros e não se responsabiliza por ele.
      </p>

      <h2>Alterações</h2>
      <p>
        Estes termos podem ser atualizados sem aviso prévio.
        A versão vigente é sempre a disponível nesta página.
      </p>
    `
  },

  "cookies": {
    title: "Política de Cookies",
    content: `
      <h1>Política de Cookies</h1>

      <p>
        Esta página explica o que são cookies e como este site os utiliza.
      </p>

      <h2>O que são cookies</h2>
      <p>
        Cookies são pequenos arquivos de texto armazenados no seu navegador
        quando você visita um site. Servem para lembrar preferências,
        manter sessões ativas e, em alguns casos, rastrear comportamento para análise.
      </p>

      <h2>Cookies neste site</h2>
      <p>
        Este site não utiliza cookies próprios. Não há rastreamento de navegação,
        análise de comportamento ou publicidade baseada em cookies.
      </p>

      <h2>Cookies de terceiros</h2>
      <p>
        O carregamento de fontes via Google Fonts pode gerar registros no lado
        do Google. Esse comportamento é regido pela política de privacidade do Google
        e está fora do controle deste site.
      </p>

      <h2>Como desativar cookies</h2>
      <p>
        Todos os navegadores modernos permitem gerenciar e desativar cookies
        nas configurações. Consulte a documentação do seu navegador para instruções específicas.
      </p>

      <h2>Contato</h2>
      <p>
        Dúvidas podem ser enviadas para
        <a href="mailto:topverbs@gmail.com">topverbs@gmail.com</a>.
      </p>
    `
  }
}

export function render(slug) {
  const page = pages[slug]
  const app = document.getElementById("app")

  if (!page) {
    app.innerHTML = `
      <div class="not-found">
        <span class="code">404</span>
        <p>Página não encontrada. <a href="#/">Voltar.</a></p>
      </div>
    `
    return
  }

  app.innerHTML = `<div class="legal-view">${page.content}</div>`
}