
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto';
import { ProdutoCard } from '../../components/produto-card/produto-card';

@Component({
  imports: [ProdutoCard, RouterLink],
  selector: 'app-inicio',
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class Inicio implements OnInit {
  private readonly produtoService = inject(ProdutoService);
  private readonly router = inject(Router);

  produtos = signal<Produto[]>([]);
  carregando = signal(true);
  erro = signal(false);

  // 4 produtos em destaque: os mais caros que ainda têm stock
  destaques = computed(() =>
    [...this.produtos()]
      .filter((p) => p.stock > 0)
      .sort((a, b) => b.price - a.price)
      .slice(0, 4)
  );

  ngOnInit(): void {
    this.produtoService.listar().subscribe({
      next: (lista) => {
        this.produtos.set(lista);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set(true);
        this.carregando.set(false);
      },
    });
  }

  // Constrói o caminho correto da imagem em localhost e no GitHub Pages
  caminhoImagem(caminho: string): string {
    if (!caminho) return '';

    // Mantém URLs completos, por exemplo, imagens alojadas online
    if (/^https?:\/\//i.test(caminho)) {
      return caminho;
    }

    // Remove barras iniciais e o prefixo do GitHub Pages, se existir
    const relativo = caminho
      .replace(/^\/+/, '')
      .replace(/^projeto-angular\//, '');

    return new URL(relativo, document.baseURI).toString();
  }

  aoVerDetalhe(produto: Produto): void {
    this.router.navigate(['/produtos', produto.id]);
  }
}
