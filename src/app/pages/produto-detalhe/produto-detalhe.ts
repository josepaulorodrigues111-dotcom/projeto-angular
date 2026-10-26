
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
  erro = signal('');

  ngOnInit(): void {
    // Lê o ID do produto a partir do endereço
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.erro.set('O identificador do produto é inválido.');
      this.carregando.set(false);
      return;
    }

    this.produtoService.obterPorId(id).subscribe({
      next: (p) => {
        this.produto.set(p);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set(this.produtoService.mensagemErro(err));
        this.carregando.set(false);
      },
    });
  }

  // Funciona com caminhos locais e URLs de imagens externas
  caminhoImagem(caminho: string): string {
    if (!caminho) return '';

    if (/^https?:\/\//i.test(caminho)) {
      return caminho;
    }

    const relativo = caminho
      .replace(/^\/+/, '')
      .replace(/^projeto-angular\//, '');

    return new URL(relativo, document.baseURI).toString();
  }
}
