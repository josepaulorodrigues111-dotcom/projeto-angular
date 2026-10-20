
import { Component, OnInit,signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProdutoService } from './services/produto.service';
import { ProdutoInterface } from './models/produto';
import { Produtos } from './pages/produtos/produtos';

@Component({
  standalone:true,
  imports: [RouterOutlet,Produtos],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {

   produtos = signal<ProdutoInterface[] >([]);

  constructor(private produtosService: ProdutoService) {}

 ngOnInit(): void {
  this.produtosService.listar().subscribe({
    next: (res) => {
      console.log('Resposta da API:', res);
      console.log('É um array?', Array.isArray(res));

      this.produtos.set(res);
      console.log('Produtos no signal:', this.produtos());
    },
    error: (err) => {
      console.error('Erro ao carregar os produtos:', err);
    }
  });
}
}
