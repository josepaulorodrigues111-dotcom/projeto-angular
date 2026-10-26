import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Produto } from '../../models/produto';
import { ProdutoCard } from './produto-card';

describe('ProdutoCard', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('mostra o produto e emite o evento para ver os detalhes', () => {
    const produto: Produto = {
      id: 9,
      title: 'Teclado',
      description: 'Teclado de teste',
      price: 25,
      category: 'gaming',
      stock: 0,
      thumbnail: '',
    };
    TestBed.configureTestingModule({ imports: [ProdutoCard] });
    const fixture = TestBed.createComponent(ProdutoCard);
    fixture.componentRef.setInput('produto', produto);
    fixture.detectChanges();
    let selecionado: Produto | undefined;
    fixture.componentInstance.verDetalhe.subscribe((value) => (selecionado = value));
    (fixture.nativeElement as HTMLElement).querySelector('button')?.click();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Esgotado');
    expect(selecionado).toEqual(produto);
  });
});
