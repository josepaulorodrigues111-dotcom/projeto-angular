import { provideHttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Produto } from '../models/produto';
import { AuthService } from './auth.service';
import { ProdutoService } from './produto.service';

describe('ProdutoService', () => {
  let http: HttpTestingController;
  let service: ProdutoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { configurado: true, token: 'jwt-user-token' } },
      ],
    });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ProdutoService);
  });

  it('consulta produtos por HttpClient e envia a sessão do utilizador', () => {
    const produto: Produto = {
      id: 7,
      title: 'Rato',
      description: 'Rato de teste',
      price: 20,
      category: 'gaming',
      stock: 3,
      thumbnail: '/images/rato.jpg',
    };
    let resposta: Produto[] | undefined;

    service.listar().subscribe((produtos) => (resposta = produtos));
    const request = http.expectOne((req) => req.url.endsWith('/rest/v1/produtos'));
    expect(request.request.method).toBe('GET');
    expect(request.request.headers.get('Authorization')).toBe('Bearer jwt-user-token');
    request.flush([produto]);

    expect(resposta).toEqual([produto]);
    http.verify();
  });

  it('apresenta uma mensagem de autorização para respostas 403', () => {
    expect(service.mensagemErro(new HttpErrorResponse({ status: 403 }))).toContain('conta autorizada');
  });

  it('envia inserção, edição e eliminação pelos métodos HTTP esperados', () => {
    const novoProduto = { title: 'Teclado', description: 'Teclado de teste', price: 20, category: 'gaming', stock: 2, thumbnail: '' };
    service.criar(novoProduto).subscribe();
    const insert = http.expectOne((req) => req.url.endsWith('/rest/v1/produtos'));
    expect(insert.request.method).toBe('POST');
    insert.flush([{ id: 10, ...novoProduto }]);

    service.editar(10, { price: 18 }).subscribe();
    const update = http.expectOne((req) => req.url.endsWith('/rest/v1/produtos') && req.params.get('id') === 'eq.10');
    expect(update.request.method).toBe('PATCH');
    update.flush([{ id: 10, ...novoProduto, price: 18 }]);

    service.apagar(10).subscribe();
    const remove = http.expectOne((req) => req.url.endsWith('/rest/v1/produtos') && req.params.get('id') === 'eq.10');
    expect(remove.request.method).toBe('DELETE');
    remove.flush(null);
    http.verify();
  });
});
