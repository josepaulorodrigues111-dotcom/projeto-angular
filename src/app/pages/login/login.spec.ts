
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../../services/auth.service';
import { Login } from './login';

describe('Login', () => {
  beforeEach(() => TestBed.resetTestingModule());

  function createLogin(isAdmin: boolean) {
    const entrar = vi.fn().mockResolvedValue(undefined);
    const navigateByUrl = vi.fn().mockResolvedValue(true);

    TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        {
          provide: AuthService,
          useValue: {
            entrar,
            autenticado: signal(true),
            eAdmin: signal(isAdmin),
            mensagemErro: (e: Error) => e.message,
          },
        },
        {
          provide: Router,
          useValue: { navigateByUrl },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: vi.fn().mockReturnValue(null),
              },
            },
          },
        },
      ],
    });

    return {
      component: TestBed.createComponent(Login).componentInstance,
      entrar,
      navigateByUrl,
    };
  }

  it('não tenta autenticar um formulário inválido', async () => {
    const { component, entrar } = createLogin(true);

    await component.submeter();

    expect(component.form.invalid).toBe(true);
    expect(entrar).not.toHaveBeenCalled();
  });

  it('encaminha um administrador para a administração após login válido', async () => {
    const { component, entrar, navigateByUrl } = createLogin(true);

    component.form.setValue({
      email: 'admin@example.test',
      password: 'secret1',
    });

    await component.submeter();

    expect(entrar).toHaveBeenCalledWith(
      'admin@example.test',
      'secret1',
    );
    expect(navigateByUrl).toHaveBeenCalledWith('/admin');
  });

  it('encaminha uma conta normal para a página inicial', async () => {
    const { component, navigateByUrl } = createLogin(false);

    component.form.setValue({
      email: 'user@example.test',
      password: 'secret1',
    });

    await component.submeter();

    expect(navigateByUrl).toHaveBeenCalledWith('/');
  });
});
