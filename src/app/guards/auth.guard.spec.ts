
import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthService } from '../services/auth.service';
import { authGuard, adminGuard } from './auth.guard';

describe('authGuard', () => {
  beforeEach(() => TestBed.resetTestingModule());

  async function executarGuard(
    guard: typeof authGuard | typeof adminGuard,
    auth: Partial<AuthService>,
  ) {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: auth },
      ],
    });

    const router = TestBed.inject(Router);

    const result = await TestBed.runInInjectionContext(() =>
      guard(
        {} as ActivatedRouteSnapshot,
        { url: '/admin' } as RouterStateSnapshot,
      ),
    );

    return { result, router };
  }

  it('envia visitantes para o login ao tentar aceder a uma rota protegida', async () => {
    const aguardarSessao = vi.fn().mockResolvedValue(undefined);

    const { result, router } = await executarGuard(authGuard, {
      aguardarSessao,
      autenticado: signal(false) as AuthService['autenticado'],
    });

    expect(aguardarSessao).toHaveBeenCalledOnce();
    expect(router.serializeUrl(result as UrlTree)).toBe(
      '/login?returnUrl=%2Fadmin',
    );
  });

  it('permite o acesso ao carrinho a utilizadores autenticados', async () => {
    const { result } = await executarGuard(authGuard, {
      aguardarSessao: async () => undefined,
      autenticado: signal(true) as AuthService['autenticado'],
    });

    expect(result).toBe(true);
  });

  it('envia visitantes que tentam aceder à administração para o login', async () => {
    const { result, router } = await executarGuard(adminGuard, {
      aguardarSessao: async () => undefined,
      autenticado: signal(false) as AuthService['autenticado'],
      eAdmin: signal(false) as AuthService['eAdmin'],
    });

    expect(router.serializeUrl(result as UrlTree)).toBe(
      '/login?returnUrl=%2Fadmin',
    );
  });

  it('impede um utilizador autenticado que não é administrador de aceder à administração', async () => {
    const { result, router } = await executarGuard(adminGuard, {
      aguardarSessao: async () => undefined,
      autenticado: signal(true) as AuthService['autenticado'],
      eAdmin: signal(false) as AuthService['eAdmin'],
    });

    expect(router.serializeUrl(result as UrlTree)).toBe('/');
  });

  it('permite o acesso à administração ao administrador', async () => {
    const { result } = await executarGuard(adminGuard, {
      aguardarSessao: async () => undefined,
      autenticado: signal(true) as AuthService['autenticado'],
      eAdmin: signal(true) as AuthService['eAdmin'],
    });

    expect(result).toBe(true);
  });
});
