import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarrinhoService } from '../../services/carrinho.service';

@Component({
  imports: [RouterLink, CurrencyPipe],
  selector: 'app-carrinho',
  styleUrl: './carrinho.css',
  templateUrl: './carrinho.html',
})
export class Carrinho {
  readonly carrinho = inject(CarrinhoService);
  compraConcluida = signal(false);

  finalizar(): void {
    // Simulação: não há encomendas na base de dados.
    this.carrinho.limpar();
    this.compraConcluida.set(true);
  }
}