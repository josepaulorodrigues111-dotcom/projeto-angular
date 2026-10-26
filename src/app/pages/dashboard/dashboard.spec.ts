import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { Produto } from '../../models/produto';
import { ProdutoService } from '../../services/produto.service';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('calcula estatísticas e apresenta o estado vazio', () => {
    const dados: Produto[] = [
      { id: 1, title: 'Produto A', description: 'A', price: 10, category: 'audio', stock: 0, thumbnail: '' },
      { id: 2, title: 'Produto B', description: 'B', price: 5, category: 'audio', stock: 2, thumbnail: '' },
    ];
    TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [provideRouter([]), { provide: ProdutoService, useValue: { listar: () => of(dados) } }],
    });
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    expect(component.total()).toBe(2);
    expect(component.esgotados()).toBe(1);
    expect(component.stockBaixo()).toBe(1);
    expect(component.valorStock()).toBe(10);
    expect(component.porCategoria()).toEqual([{ categoria: 'audio', quantidade: 2 }]);
  });
});
