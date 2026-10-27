
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { ProdutoService } from '../../services/produto.service';
import { CarrinhoService } from '../../services/carrinho.service';
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
  private readonly carrinhoService = inject(CarrinhoService);

  produto = signal<Produto | null>(null);
  carregando = signal(true);
  erro = signal('');
  mensagemCarrinho = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.erro.set('O identificador do produto é inválido.');
      this.carregando.set(false);
      return;
    }

    this.produtoService.obterPorId(id).subscribe({
      next: (produto) => {
        if (!produto) {
          this.erro.set('O produto solicitado não foi encontrado.');
        } else {
          this.produto.set(produto);
        }

        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set(this.produtoService.mensagemErro(err));
        this.carregando.set(false);
      },
    });
  }

  adicionarAoCarrinho(): void {
    const produto = this.produto();

    if (!produto || produto.stock <= 0) {
      return;
    }

    const quantidadeAntes =
      this.carrinhoService.itens()
        .find((item) => item.produto.id === produto.id)?.quantidade ?? 0;

    this.carrinhoService.adicionar(produto);

    const quantidadeDepois =
      this.carrinhoService.itens()
        .find((item) => item.produto.id === produto.id)?.quantidade ?? 0;

    if (quantidadeDepois > quantidadeAntes) {
      this.mensagemCarrinho.set('Produto adicionado ao carrinho.');
    } else {
      this.mensagemCarrinho.set(
        'Não foi possível adicionar mais unidades. Verifica o stock disponível.',
      );
    }
  }

  caminhoImagem(caminho: string): string {
    if (!caminho) {
      return '';
    }

    const valor = caminho.trim();

    // Mantém URLs completas, por exemplo imagens alojadas no Supabase.
    if (/^https?:\/\//i.test(valor)) {
      return valor;
    }

    // Remove barras iniciais e o prefixo do GitHub Pages, se existir.
    const relativo = valor
      .replace(/^\/+/, '')
      .replace(/^projeto-angular\//i, '');

    // Usa o endereço base da aplicação, incluindo o subdiretório
    // /projeto-angular/ quando a aplicação está no GitHub Pages.
    return new URL(relativo, document.baseURI).toString();
  }
}
