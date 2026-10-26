import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { Produto } from '../../models/produto';
import { ProdutoService } from '../../services/produto.service';
import { Produtos } from './produtos';

describe('Produtos', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('atualiza a pesquisa e o filtro por categoria sem manipulação do DOM', () => {
    const dados: Produto[] = [
      { id: 1, title: 'Rato Gaming', description: 'Rato', price: 20, category: 'gaming', stock: 2, thumbnail: '' },
      { id: 2, title: 'Coluna', description: 'Coluna', price: 50, category: 'audio', stock: 5, thumbnail: '' },
    ];
    TestBed.configureTestingModule({
      imports: [Produtos],
      providers: [provideRouter([]), { provide: ProdutoService, useValue: { listar: () => of(dados) } }],
    });
    const fixture = TestBed.createComponent(Produtos);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    expect(component.produtosFiltrados().length).toBe(2);
    component.pesquisa.set('rato');
    expect(component.produtosFiltrados().map((p) => p.id)).toEqual([1]);
    component.pesquisa.set('');
    component.categoria.set('audio');
    expect(component.produtosFiltrados().map((p) => p.id)).toEqual([2]);
    expect(component.carregando()).toBe(false);
  });
});
