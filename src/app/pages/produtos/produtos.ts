import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ProdutoInterface } from '../../models/produto';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CurrencyPipe],
  styleUrl: './produtos.css',
  templateUrl: './produtos.html',
})
export class Produtos {
  @Input() produto!: ProdutoInterface;
}