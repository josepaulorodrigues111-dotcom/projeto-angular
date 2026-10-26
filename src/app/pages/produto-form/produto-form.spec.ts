import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProdutoService } from '../../services/produto.service';
import { ProdutoForm } from './produto-form';

@Component({ standalone: true, template: '' })
class AdminRouteStub {}

describe('ProdutoForm', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('valida os campos obrigatórios e só cria após uma submissão válida', () => {
    const criar = vi.fn().mockReturnValue(of({ id: 3 }));
    TestBed.configureTestingModule({
      imports: [ProdutoForm],
      providers: [
        provideRouter([{ path: 'admin', component: AdminRouteStub }]),
        { provide: ProdutoService, useValue: { obterPorId: vi.fn(), criar, editar: vi.fn(), mensagemErro: (e: Error) => e.message } },
      ],
    });
    const fixture = TestBed.createComponent(ProdutoForm);
    const component = fixture.componentInstance;

    expect(component.form.invalid).toBe(true);
    component.form.setValue({
      title: 'Produto teste',
      description: 'Descrição suficientemente longa',
      price: 12.5,
      category: 'audio',
      stock: 4,
      thumbnail: '/images/teste.jpg',
    });
    expect(component.form.valid).toBe(true);
    component.submeter();
    expect(criar).toHaveBeenCalledOnce();
  });
});
