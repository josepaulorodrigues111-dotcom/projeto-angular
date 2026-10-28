import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto';


@Component({
  imports: [RouterLink, CurrencyPipe, TitleCasePipe],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private readonly produtoService = inject(ProdutoService);

  produtos = signal<Produto[]>([]);
  carregando = signal(true);
  erro = signal('');

  produtoSelecionado = signal<Produto | null>(null);
  apagando = signal(false);
  erroApagar = signal('');

  total = computed(() => this.produtos().length);

  esgotados = computed(
    () => this.produtos().filter((p) => p.stock === 0).length
  );

  stockBaixo = computed(
    () => this.produtos().filter((p) => p.stock > 0 && p.stock <= 5).length
  );

  valorStock = computed(() =>
    this.produtos().reduce((soma, p) => soma + p.price * p.stock, 0)
  );

  porCategoria = computed(() => {
    const contagem = new Map<string, number>();

    for (const p of this.produtos()) {
      contagem.set(p.category, (contagem.get(p.category) ?? 0) + 1);
    }

    return [...contagem.entries()].map(([categoria, quantidade]) => ({
      categoria,
      quantidade,
    }));
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

  abrirModalApagar(produto: Produto): void {
    if (this.apagando()) {
      return;
    }

    this.erroApagar.set('');
    this.produtoSelecionado.set(produto);
  }

  fecharModal(): void {
    if (this.apagando()) {
      return;
    }

    this.produtoSelecionado.set(null);
    this.erroApagar.set('');
  }

  confirmarApagar(): void {
    const produto = this.produtoSelecionado();

    if (!produto || this.apagando()) {
      return;
    }

    this.apagando.set(true);
    this.erroApagar.set('');

    this.produtoService.apagar(produto.id).subscribe({
      next: () => {
        this.produtos.update((lista) =>
          lista.filter((p) => p.id !== produto.id)
        );

        this.apagando.set(false);
        this.produtoSelecionado.set(null);
        this.erroApagar.set('');
      },
      error: (err) => {
        this.erroApagar.set(this.produtoService.mensagemErro(err));
        this.apagando.set(false);
      },
    });
  }
}
