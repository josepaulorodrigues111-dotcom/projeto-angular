import { Injectable, signal } from '@angular/core';
import {
  createClient,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly client: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseKey
  );

  private readonly pronta: Promise<void>;

  readonly sessao = signal<Session | null>(null);
  readonly autenticado = signal(false);
  readonly eAdmin = signal(false);

  constructor() {
    this.pronta = this.client.auth.getSession().then(async ({ data }) => {
      this.atualizarSessao(data.session);
      await this.verificarAdministrador(data.session);
    });

    this.client.auth.onAuthStateChange((_evento, sessao) => {
      this.atualizarSessao(sessao);

      if (!sessao) {
        this.eAdmin.set(false);
        return;
      }

      // A consulta à base de dados é feita fora do callback de autenticação.
      setTimeout(() => {
        void this.verificarAdministrador(sessao);
      }, 0);
    });
  }

  private atualizarSessao(sessao: Session | null): void {
    this.sessao.set(sessao);
    this.autenticado.set(sessao !== null);

    if (!sessao) {
      this.eAdmin.set(false);
    }
  }

  private async verificarAdministrador(
    sessao: Session | null
  ): Promise<void> {
    if (!sessao) {
      this.eAdmin.set(false);
      return;
    }

    try {
      const { data, error } = await this.client.rpc(
        'shop_manager_is_admin'
      );

      // Uma resposta antiga nunca deve alterar a permissão de outra sessão.
      if (this.sessao()?.user.id !== sessao.user.id) {
        return;
      }

      this.eAdmin.set(!error && data === true);
    } catch {
      // Se não for possível confirmar a autorização, não conceder acesso.
      if (this.sessao()?.user.id === sessao.user.id) {
        this.eAdmin.set(false);
      }
    }
  }

  aguardarSessao(): Promise<void> {
    return this.pronta;
  }

  async entrar(email: string, password: string): Promise<void> {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    this.atualizarSessao(data.session);
    await this.verificarAdministrador(data.session);
  }

  async registar(
    nome: string,
    email: string,
    password: string
  ): Promise<boolean> {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: nome,
        },
      },
    });

    if (error) {
      throw error;
    }

    this.atualizarSessao(data.session);
    await this.verificarAdministrador(data.session);

    // true: sessão criada.
    // false: é necessária confirmação de email.
    return data.session !== null;
  }

  async sair(): Promise<void> {
    const { error } = await this.client.auth.signOut();

    if (error) {
      throw error;
    }

    this.atualizarSessao(null);
  }

  mensagemErro(error: unknown): string {
    const mensagem =
      error instanceof Error ? error.message.toLowerCase() : '';

    if (mensagem.includes('invalid login credentials')) {
      return 'Email ou palavra-passe incorretos.';
    }

    if (mensagem.includes('email not confirmed')) {
      return 'Confirma o email antes de iniciar sessão.';
    }

    if (
      mensagem.includes('already registered') ||
      mensagem.includes('user already registered')
    ) {
      return 'Este email já tem conta.';
    }

    if (
      mensagem.includes('signups not allowed') ||
      mensagem.includes('signup_disabled')
    ) {
      return 'O registo de novas contas está temporariamente desativado.';
    }

    if (
      mensagem.includes('password should be at least') ||
      mensagem.includes('weak password')
    ) {
      return 'A palavra-passe não cumpre os requisitos de segurança.';
    }

    if (mensagem.includes('network') || mensagem.includes('fetch')) {
      return 'Não foi possível contactar o Supabase. Verifica a ligação.';
    }

    return 'Não foi possível concluir a operação. Verifica os dados e tenta novamente.';
  }

  get token(): string | null {
    return this.sessao()?.access_token ?? null;
  }

  get email(): string | null {
    return this.sessao()?.user.email ?? null;
  }
}
