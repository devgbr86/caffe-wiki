// ===================================
// CAFFEWIKI — src/lib/marked.js
// ===================================
// Carrega marked.js e DOMPurify via CDN e expõe globalmente.
// Substitua as URLs por builds locais se quiser remover dependência de rede.
// ===================================

(function () {
  function loadScript(src, onload) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = onload;
    s.onerror = function () {
      console.error('[CaffeWiki] Falha ao carregar: ' + src);
    };
    document.head.appendChild(s);
  }

  // Carrega DOMPurify primeiro, depois marked
  loadScript(
    'https://cdn.jsdelivr.net/npm/dompurify/dist/purify.min.js',
    function () {
      loadScript(
        'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
        function () {
          // Dispara evento para sinalizar que as libs estão prontas
          window.dispatchEvent(new Event('caffewiki:libs-ready'));
        }
      );
    }
  );
})();