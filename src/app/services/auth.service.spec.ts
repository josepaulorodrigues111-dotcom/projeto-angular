import { TestBed } from '@angular/core/testing';
import { Session } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SupabaseService } from './supabase';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const session = {
    access_token: 'test-access-token',
    refresh_token: 'test-refresh-token',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: 4_000_000_000,
    user: { id: 'user-1', email: 'admin@example.test' },
  } as Session;

  let getSession: ReturnType<typeof vi.fn>;
  let signIn: ReturnType<typeof vi.fn>;
  let signOut: ReturnType<typeof vi.fn>;
  let rpc: ReturnType<typeof vi.fn>;

  function configure(initialSession: Session | null, isAdmin: boolean) {
    getSession = vi.fn().mockResolvedValue({ data: { session: initialSession }, error: null });
    signIn = vi.fn().mockResolvedValue({ data: { session, user: session.user }, error: null });
    signOut = vi.fn().mockResolvedValue({ error: null });
    rpc = vi.fn().mockResolvedValue({ data: isAdmin, error: null });
    const client = {
      auth: {
        getSession,
        signInWithPassword: signIn,
        signOut,
        onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      },
      rpc,
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: SupabaseService, useValue: { configurado: true, client } },
      ],
    });
  }

  beforeEach(() => TestBed.resetTestingModule());

  it('restaura a sessão e confirma a autorização antes de resolver pronta', async () => {
    configure(session, true);
    const auth = TestBed.inject(AuthService);

    await auth.pronta;

    expect(auth.autenticado()).toBe(true);
    expect(auth.administrador()).toBe(true);
    expect(rpc).toHaveBeenCalledWith('shop_manager_is_admin');
  });

  it('mantém utilizadores autenticados sem papel administrativo fora da administração', async () => {
    configure(session, false);
    const auth = TestBed.inject(AuthService);

    await auth.pronta;

    expect(auth.autenticado()).toBe(true);
    expect(auth.administrador()).toBe(false);
    expect(await auth.verificarAcessoAdministrador()).toBe(false);
  });

  it('não limpa a sessão quando o logout devolve um erro', async () => {
    configure(session, true);
    signOut = vi.fn().mockResolvedValue({ error: new Error('offline') });
    const client = {
      auth: {
        getSession,
        signInWithPassword: signIn,
        signOut,
        onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      },
      rpc,
    };
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [AuthService, { provide: SupabaseService, useValue: { configurado: true, client } }],
    });
    const auth = TestBed.inject(AuthService);
    await auth.pronta;

    await expect(auth.sair()).rejects.toThrow('offline');
    expect(auth.autenticado()).toBe(true);
  });

  it('mapeia credenciais inválidas para uma mensagem clara', async () => {
    configure(null, false);
    signIn.mockResolvedValue({ data: { session: null, user: null }, error: new Error('Invalid login credentials') });
    const auth = TestBed.inject(AuthService);
    await auth.pronta;

    await expect(auth.entrar('x@example.test', 'wrong-password')).rejects.toThrow('Invalid login credentials');
    expect(auth.mensagemErro(new Error('Invalid login credentials'))).toBe('Email ou palavra-passe incorretos.');
  });

  it('reporta quando o login exige confirmação do email e não criou sessão', async () => {
    configure(null, false);
    signIn.mockResolvedValue({ data: { session: null, user: null }, error: null });
    const auth = TestBed.inject(AuthService);
    await auth.pronta;

    expect(await auth.entrar('user@example.test', 'secret1')).toBe(false);
    expect(auth.autenticado()).toBe(false);
  });
});
