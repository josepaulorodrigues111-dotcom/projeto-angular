import { Injectable, computed, effect, signal } from '@angular/core';
import { Produto } from '../models/produto';
import { ItemCarrinho } from '../models/item-carrinho';

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  private readonly chave = 'carrinho';

  itens = signal<ItemCarrinho[]>(this.carregar());

  quantidadeTotal = computed(() =>
    this.itens().reduce((soma, i) => soma + i.quantidade, 0)
  );
  total = computed(() =>
    this.itens().reduce((soma, i) => soma + i.produto.price * i.quantidade, 0)
  );

  constructor() {
    effect(() => this.guardar(this.itens()));
  }

  adicionar(produto: Produto): void {
    if (produto.stock <= 0) return;

    this.itens.update((lista) => {
      const existente = lista.find((i) => i.produto.id === produto.id);
      if (!existente) return [...lista, { produto, quantidade: 1 }];
      if (existente.quantidade >= produto.stock) return lista;
      return lista.map((i) =>
        i.produto.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i
      );
    });
  }

  alterarQuantidade(id: number, quantidade: number): void {
    if (quantidade < 1) {
      this.remover(id);
      return;
    }
    this.itens.update((lista) =>
      lista.map((i) =>
        i.produto.id === id
          ? { ...i, quantidade: Math.min(quantidade, i.produto.stock) }
          : i
      )
    );
  }

  remover(id: number): void {
    this.itens.update((lista) => lista.filter((i) => i.produto.id !== id));
  }

  limpar(): void {
    this.itens.set([]);
  }

  private carregar(): ItemCarrinho[] {
    try {
      const texto = localStorage.getItem(this.chave);
      return texto ? JSON.parse(texto) : [];
    } catch {
      return [];
    }
  }

  private guardar(itens: ItemCarrinho[]): void {
    try {
      localStorage.setItem(this.chave, JSON.stringify(itens));
    } catch {
      // sem armazenamento disponível: ignora
    }
  }
}