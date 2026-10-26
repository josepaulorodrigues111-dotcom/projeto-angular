import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../../services/auth.service';
import { Login } from './login';

describe('Login', () => {
  beforeEach(() => TestBed.resetTestingModule());

  function createLogin(isAdmin: boolean) {
    const entrar = vi.fn().mockResolvedValue(true);
    const navigate = vi.fn().mockResolvedValue(true);
    TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: AuthService, useValue: { entrar, administrador: signal(isAdmin), erroAutorizacao: signal(false), mensagemErro: (e: Error) => e.message } },
        { provide: Router, useValue: { navigate } },
      ],
    });
    return { component: TestBed.createComponent(Login).componentInstance, entrar, navigate };
  }

  it('não tenta autenticar um formulário inválido', async () => {
    const { component, entrar } = createLogin(true);
    await component.submeter();
    expect(component.form.invalid).toBe(true);
    expect(entrar).not.toHaveBeenCalled();
  });

  it('encaminha um administrador para a administração após login válido', async () => {
    const { component, entrar, navigate } = createLogin(true);
    component.form.setValue({ email: 'admin@example.test', password: 'secret1' });
    await component.submeter();
    expect(entrar).toHaveBeenCalledWith('admin@example.test', 'secret1');
    expect(navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('não encaminha uma conta normal para a administração', async () => {
    const { component, navigate } = createLogin(false);
    component.form.setValue({ email: 'user@example.test', password: 'secret1' });
    await component.submeter();
    expect(navigate).toHaveBeenCalledWith(['/sem-permissao']);
  });
});
