import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { Produto } from '../../models/produto';
import { ProdutoService } from '../../services/produto.service';
import { Inicio } from './inicio';

describe('Inicio', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('apresenta até quatro produtos disponíveis em destaque', () => {
    const dados: Produto[] = Array.from({ length: 6 }, (_, index) => ({
      id: index + 1,
      title: `Produto ${index + 1}`,
      description: 'Produto de teste',
      price: 10 + index,
      category: 'audio',
      stock: index === 5 ? 0 : 1,
      thumbnail: '',
    }));
    TestBed.configureTestingModule({
      imports: [Inicio],
      providers: [provideRouter([]), { provide: ProdutoService, useValue: { listar: () => of(dados) } }],
    });
    const fixture = TestBed.createComponent(Inicio);
    fixture.detectChanges();

    expect(fixture.componentInstance.destaques().length).toBe(4);
    expect(fixture.componentInstance.destaques().every((produto) => produto.stock > 0)).toBe(true);
  });
});
