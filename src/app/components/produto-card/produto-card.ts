import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Produto } from '../../models/produto';

@Component({
  imports: [CurrencyPipe, TitleCasePipe],
  selector: 'app-produto-card',
  styleUrl: './produto-card.css',
  templateUrl: './produto-card.html',
})
export class ProdutoCard {
  @Input({ required: true }) produto!: Produto;
  @Output() verDetalhe = new EventEmitter<Produto>();

  get disponibilidade(): 'esgotado' | 'poucas' | 'disponivel' {
    if (this.produto.stock === 0) return 'esgotado';
    if (this.produto.stock <= 5) return 'poucas';
    return 'disponivel';
  }
}