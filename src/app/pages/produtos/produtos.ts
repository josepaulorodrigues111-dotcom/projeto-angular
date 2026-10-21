import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto';
import { ProdutoCard } from '../../components/produto-card/produto-card';

@Component({
  imports: [ProdutoCard, FormsModule],
  selector: 'app-produtos',
  styleUrl: './produtos.css',
  templateUrl: './produtos.html',
})
export class Produtos implements OnInit {
  private readonly produtoService = inject(ProdutoService);
  private readonly router = inject(Router);

  produtos = signal<Produto[]>([]);
  carregando = signal(true);
  erro = signal(false);

  pesquisa = signal('');
  categoria = signal('');

  // Categorias distintas, calculadas a partir dos produtos
  categorias = computed(() =>
    [...new Set(this.produtos().map((p) => p.category))].sort()
  );

  // Lista filtrada por texto e categoria
  produtosFiltrados = computed(() => {
    const texto = this.pesquisa().trim().toLowerCase();
    const cat = this.categoria();
    return this.produtos().filter(
      (p) =>
        p.title.toLowerCase().includes(texto) &&
        (cat === '' || p.category === cat)
    );
  });

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

  aoVerDetalhe(produto: Produto): void {
    this.router.navigate(['/produtos', produto.id]);
  }
}