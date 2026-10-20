import { Component, OnInit, inject, signal } from '@angular/core';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto';
import { ProdutoCard } from '../../components/produto-card/produto-card';

@Component({
  imports: [ProdutoCard],
  selector: 'app-produtos',
  styleUrl: './produtos.css',
  templateUrl: './produtos.html',
})
export class Produtos implements OnInit {
  private readonly produtoService = inject(ProdutoService);

  produtos = signal<Produto[]>([]);
  carregando = signal(true);
  erro = signal(false);

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
    console.log('Ver detalhe:', produto.title);
  }
}