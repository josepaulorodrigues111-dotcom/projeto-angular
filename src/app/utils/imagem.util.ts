export function caminhoImagem(caminho: string): string {
  if (!caminho) {
    return '';
  }

  return new URL(caminho.replace(/^\/+/, ''), document.baseURI).href;
}