import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto';

@Component({
  imports: [RouterLink, CurrencyPipe, TitleCasePipe],
  selector: 'app-produto-detalhe',
  styleUrl: './produto-detalhe.css',
  templateUrl: './produto-detalhe.html',
})
export class ProdutoDetalhe implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly produtoService = inject(ProdutoService);

  produto = signal<Produto | null>(null);
  carregando = signal(true);
  erro = signal(false);

  ngOnInit(): void {
    // Lê o :id do endereço
    const id = this.route.snapshot.paramMap.get('id')!;

    this.produtoService.obterPorId(id).subscribe({
      next: (p) => {
        this.produto.set(p);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set(true);
        this.carregando.set(false);
      },
    });
  }
}