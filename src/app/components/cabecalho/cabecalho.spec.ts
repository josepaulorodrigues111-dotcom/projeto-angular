
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../../services/auth.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { Cabecalho } from './cabecalho';

describe('Cabecalho', () => {
  beforeEach(() => TestBed.resetTestingModule());

  function configurarCabecalho(autenticado: boolean, eAdmin: boolean) {
    TestBed.configureTestingModule({
      imports: [Cabecalho],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            autenticado: signal(autenticado),
            eAdmin: signal(eAdmin),
            sair: vi.fn().mockResolvedValue(undefined),
            mensagemErro: vi.fn().mockReturnValue('Ocorreu um erro.'),
          },
        },
        {
          provide: CarrinhoService,
          useValue: {
            itens: signal([]),
            quantidadeTotal: signal(0),
            limpar: vi.fn(),
          },
        },
      ],
    });

    return TestBed.createComponent(Cabecalho);
  }

  it('mostra Sair para utilizadores autenticados, mas não mostra Administração a clientes', () => {
    const fixture = configurarCabecalho(true, false);

    fixture.detectChanges();

    const html = fixture.nativeElement as HTMLElement;

    expect(html.textContent).toContain('Sair');
    expect(html.textContent).not.toContain('Administração');
  });

  it('mostra Administração quando a permissão de administrador está confirmada', () => {
    const fixture = configurarCabecalho(true, true);

    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Administração',
    );
  });
});
