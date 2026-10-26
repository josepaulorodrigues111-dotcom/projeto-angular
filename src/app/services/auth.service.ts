import { Injectable, computed, signal } from '@angular/core';
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly client: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseKey
  );

  sessao = signal<Session | null>(null);
  autenticado = computed(() => this.sessao() !== null);

  constructor() {
    this.client.auth.getSession().then(({ data }) => this.sessao.set(data.session));
    this.client.auth.onAuthStateChange((_evento, sessao) => this.sessao.set(sessao));
  }

  async entrar(email: string, password: string): Promise<void> {
    const { error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async registar(email: string, password: string): Promise<void> {
    const { error } = await this.client.auth.signUp({ email, password });
    if (error) throw error;
  }

  async sair(): Promise<void> {
    await this.client.auth.signOut();
  }

  get token(): string | null {
    return this.sessao()?.access_token ?? null;
  }

  get email(): string | null {
    return this.sessao()?.user.email ?? null;
  }
}