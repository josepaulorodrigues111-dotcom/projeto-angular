import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto';
import { ProdutoCard } from '../../components/produto-card/produto-card';

@Component({
  selector: 'app-produtos',
  imports: [ProdutoCard, FormsModule],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css',
})
export class Produtos implements OnInit {
  private readonly produtoService = inject(ProdutoService);
  private readonly router = inject(Router);

  produtos = signal<Produto[]>([]);
  carregando = signal(true);
  erro = signal('');

  pesquisa = signal('');
  categoria = signal('');

  get textoPesquisa(): string {
    return this.pesquisa();
  }

  set textoPesquisa(valor: string) {
    this.pesquisa.set(valor);
  }

  categorias = computed(() =>
    [...new Set(this.produtos().map((p) => p.category))].sort()
  );

  produtosFiltrados = computed(() => {
    const texto = this.pesquisa().trim().toLowerCase();
    const cat = this.categoria();

    return this.produtos().filter(
      (p) =>
        p.title.toLowerCase().includes(texto) &&
        (cat === '' || p.category === cat)
    );
  });

  ngOnInit(): void {
    this.produtoService.listar().subscribe({
      next: (lista) => {
        this.produtos.set(lista);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set(this.produtoService.mensagemErro(err));
        this.carregando.set(false);
      },
    });
  }

  limparFiltros(): void {
    this.pesquisa.set('');
    this.categoria.set('');
  }

  aoVerDetalhe(produto: Produto): void {
    this.router.navigate(['/produtos', produto.id]);
  }
}
