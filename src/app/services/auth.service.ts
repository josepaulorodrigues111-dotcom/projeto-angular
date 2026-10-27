import { Injectable, computed, signal } from '@angular/core';
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly client: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseKey
  );
  private readonly pronta: Promise<void>;

  sessao = signal<Session | null>(null);
  autenticado = computed(() => this.sessao() !== null);
  eAdmin = computed(
    () =>
      this.sessao()?.user.email?.toLowerCase() ===
      environment.adminEmail.toLowerCase()
  );

  constructor() {
    this.pronta = this.client.auth
      .getSession()
      .then(({ data }) => this.sessao.set(data.session));
    this.client.auth.onAuthStateChange((_evento, sessao) => this.sessao.set(sessao));
  }

  // Os guards esperam que a sessão guardada seja recuperada
  aguardarSessao(): Promise<void> {
    return this.pronta;
  }

  async entrar(email: string, password: string): Promise<void> {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    this.sessao.set(data.session);
  }

  async registar(email: string, password: string): Promise<void> {
    const { data, error } = await this.client.auth.signUp({ email, password });
    if (error) throw error;
    this.sessao.set(data.session);
  }

  async sair(): Promise<void> {
    await this.client.auth.signOut();
    this.sessao.set(null);
  }

  mensagemErro(error: unknown): string {
    const mensagem = error instanceof Error ? error.message.toLowerCase() : '';
    if (mensagem.includes('invalid login credentials')) return 'Email ou palavra-passe incorretos.';
    if (mensagem.includes('email not confirmed')) return 'Confirma o email antes de iniciar sessão.';
    if (mensagem.includes('already registered')) return 'Este email já tem conta.';
    if (mensagem.includes('signups not allowed') || mensagem.includes('signup_disabled'))
      return 'O registo de novas contas está temporariamente desativado.';
    if (mensagem.includes('network') || mensagem.includes('fetch'))
      return 'Não foi possível contactar o Supabase. Verifica a ligação.';
    return 'Não foi possível concluir a operação. Verifica os dados e tenta novamente.';
  }

  get token(): string | null {
    return this.sessao()?.access_token ?? null;
  }

  get email(): string | null {
    return this.sessao()?.user.email ?? null;
  }
}