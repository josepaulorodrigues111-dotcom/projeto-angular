import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../../services/auth.service';
import { Cabecalho } from './cabecalho';

describe('Cabecalho', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('mostra administração só para administradores e logout para sessões autenticadas', () => {
    TestBed.configureTestingModule({
      imports: [Cabecalho],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { autenticado: signal(true), administrador: signal(false), sair: vi.fn() } },
      ],
    });
    const fixture = TestBed.createComponent(Cabecalho);
    fixture.detectChanges();
    const html = fixture.nativeElement as HTMLElement;

    expect(html.textContent).toContain('Sair');
    expect(html.textContent).not.toContain('Administração');
  });

  it('mostra o controlo de administração quando a permissão está confirmada', () => {
    TestBed.configureTestingModule({
      imports: [Cabecalho],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { autenticado: signal(true), administrador: signal(true), sair: vi.fn() } },
      ],
    });
    const fixture = TestBed.createComponent(Cabecalho);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Administração');
  });
});
