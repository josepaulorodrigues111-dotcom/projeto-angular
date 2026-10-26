import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  beforeEach(() => TestBed.resetTestingModule());

  async function navigateWith(auth: Partial<AuthService>) {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: auth }],
    });
    const router = TestBed.inject(Router);
    const result = await TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, { url: '/admin' } as RouterStateSnapshot),
    );
    return { result, router };
  }

  it('envia visitantes para o login depois de aguardar a sessão', async () => {
    const pronta = Promise.resolve();
    const { result, router } = await navigateWith({ pronta, autenticado: signal(false) });
    expect(router.serializeUrl(result as UrlTree)).toBe('/login');
  });

  it('nega a rota a utilizadores autenticados que não são administradores', async () => {
    const verificarAcessoAdministrador = vi.fn().mockResolvedValue(false);
    const { result, router } = await navigateWith({
      pronta: Promise.resolve(),
      autenticado: signal(true) as AuthService['autenticado'],
      verificarAcessoAdministrador,
    });
    expect(verificarAcessoAdministrador).toHaveBeenCalledOnce();
    expect(router.serializeUrl(result as UrlTree)).toBe('/sem-permissao');
  });

  it('permite a rota apenas após confirmar o administrador', async () => {
    const { result } = await navigateWith({
      pronta: Promise.resolve(),
      autenticado: signal(true) as AuthService['autenticado'],
      verificarAcessoAdministrador: vi.fn().mockResolvedValue(true),
    });
    expect(result).toBe(true);
  });
});
