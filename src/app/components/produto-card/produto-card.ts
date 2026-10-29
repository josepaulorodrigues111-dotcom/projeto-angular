import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Produto } from '../../models/produto';

@Component({
  selector: 'app-produto-card',
  standalone: true,
  imports: [CurrencyPipe, TitleCasePipe],
  templateUrl: './produto-card.html',
  styleUrl: './produto-card.css',
})
export class ProdutoCard {
  @Input({ required: true }) produto!: Produto;

  @Output() verDetalhe = new EventEmitter<Produto>();

  get disponibilidade(): 'esgotado' | 'poucas' | 'disponivel' {
    if (this.produto.stock === 0) return 'esgotado';
    if (this.produto.stock <= 5) return 'poucas';
    return 'disponivel';
  }

  caminhoImagem(caminho: string): string {
    if (!caminho) return '';

    if (/^https?:\/\//i.test(caminho)) {
      return caminho;
    }

    return new URL(
      caminho.replace(/^\/+/, ''),
      document.baseURI
    ).href;
  }
}
