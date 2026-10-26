import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { Produto } from '../../models/produto';
import { ProdutoService } from '../../services/produto.service';
import { ProdutoDetalhe } from './produto-detalhe';

describe('ProdutoDetalhe', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('carrega e apresenta o produto identificado na rota', () => {
    const produto: Produto = {
      id: 5,
      title: 'Coluna Bluetooth',
      description: 'Coluna de teste',
      price: 49,
      category: 'audio',
      stock: 6,
      thumbnail: '/images/coluna.jpg',
    };
    TestBed.configureTestingModule({
      imports: [ProdutoDetalhe],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '5' }) } } },
        { provide: ProdutoService, useValue: { obterPorId: () => of(produto) } },
      ],
    });
    const fixture = TestBed.createComponent(ProdutoDetalhe);
    fixture.detectChanges();

    expect(fixture.componentInstance.produto()).toEqual(produto);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Coluna Bluetooth');
  });
});
