export function caminhoImagem(caminho: string): string {
  const valor = caminho?.trim();

  if (!valor) {
    return '';
  }

  // Imagens alojadas num URL completo, por exemplo no Supabase.
  if (/^https?:\/\//i.test(valor)) {
    return valor;
  }

  // Remove barras iniciais e um eventual prefixo do GitHub Pages.
  const relativo = valor
    .replace(/^\/+/, '')
    .replace(/^projeto-angular\//i, '');

  // Resolve o caminho relativamente à aplicação.
  return new URL(relativo, document.baseURI).href;
}
