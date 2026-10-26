import { Injectable, computed, inject, signal } from '@angular/core';
import { Session } from '@supabase/supabase-js';
import { SupabaseService } from './supabase';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService);

  sessao = signal<Session | null>(null);
  autenticado = computed(() => this.sessao() !== null);
  administrador = signal<boolean | null>(null);
  inicializada = signal(false);
  erroAutorizacao = signal(false);
  readonly pronta: Promise<void>;
  private verificacao = 0;

  constructor() {
    this.pronta = this.inicializar();
  }

  private async inicializar(): Promise<void> {
    const client = this.supabase.client;
    if (!client) {
      this.inicializada.set(true);
      this.administrador.set(false);
      return;
    }

    try {
      const { data, error } = await client.auth.getSession();
      if (error) throw error;
      this.sessao.set(data.session);
      if (data.session) await this.atualizarAdministrador(data.session);
      else this.administrador.set(false);
    } catch {
      this.sessao.set(null);
      this.administrador.set(false);
      this.erroAutorizacao.set(true);
    } finally {
      this.inicializada.set(true);
    }

    client.auth.onAuthStateChange((_evento, sessao) => {
      this.sessao.set(sessao);
      this.verificacao++;
      if (!sessao) {
        this.administrador.set(false);
        this.erroAutorizacao.set(false);
        return;
      }

      this.administrador.set(null);
      // Consultas Supabase não devem ser aguardadas dentro do callback de auth.
      queueMicrotask(() => void this.atualizarAdministrador(sessao));
    });
  }

  async verificarAcessoAdministrador(): Promise<boolean> {
    await this.pronta;
    const sessao = this.sessao();
    if (!sessao) return false;
    return this.atualizarAdministrador(sessao);
  }

  private async atualizarAdministrador(sessao: Session): Promise<boolean> {
    const client = this.supabase.client;
    if (!client) {
      this.administrador.set(false);
      this.erroAutorizacao.set(true);
      return false;
    }

    const versao = ++this.verificacao;
    try {
      const { data, error } = await client.rpc('shop_manager_is_admin');
      if (error) throw error;
      const autorizado = data === true;
      if (versao === this.verificacao && this.sessao()?.user.id === sessao.user.id) {
        this.administrador.set(autorizado);
        this.erroAutorizacao.set(false);
      }
      return autorizado;
    } catch {
      if (versao === this.verificacao) {
        this.administrador.set(false);
        this.erroAutorizacao.set(true);
      }
      return false;
    }
  }

  async entrar(email: string, password: string): Promise<boolean> {
    await this.pronta;
    const client = this.supabase.client;
    if (!client) throw new Error('Configuração do Supabase em falta. Consulta o README.');
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    this.sessao.set(data.session);
    this.inicializada.set(true);
    if (data.session) await this.atualizarAdministrador(data.session);
    else this.administrador.set(false);
    return data.session !== null;
  }

  async sair(): Promise<void> {
    await this.pronta;
    const client = this.supabase.client;
    if (!client) throw new Error('Configuração do Supabase em falta. Consulta o README.');
    const { error } = await client.auth.signOut();
    if (error) throw error;
    this.sessao.set(null);
    this.administrador.set(false);
  }

  mensagemErro(error: unknown): string {
    if (error instanceof Error && error.message.includes('Configuração do Supabase')) {
      return error.message;
    }
    const mensagem = error instanceof Error ? error.message.toLowerCase() : '';
    if (mensagem.includes('invalid login credentials')) return 'Email ou palavra-passe incorretos.';
    if (mensagem.includes('email not confirmed')) return 'Confirma o email antes de iniciar sessão.';
    if (mensagem.includes('network')) return 'Não foi possível contactar o Supabase. Verifica a ligação.';
    return 'Não foi possível concluir a operação. Verifica os dados e tenta novamente.';
  }

  get token(): string | null {
    return this.sessao()?.access_token ?? null;
  }

  get configurado(): boolean {
    return this.supabase.configurado;
  }

  get email(): string | null {
    return this.sessao()?.user.email ?? null;
  }
}
