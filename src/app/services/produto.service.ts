import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { Produto } from '../models/produto';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly url = `${environment.supabaseUrl}/rest/v1/produtos`;

  // Falso se o URL/chave ainda forem os marcadores do environment.ts
  private get configurado(): boolean {
    return (
      environment.supabaseUrl.startsWith('http') &&
      environment.supabaseKey !== 'SUPABASE_KEY'
    );
  }

  // Sem sessão usa a chave pública (leitura); com sessão usa o token do utilizador (escrita)
  private get headers(): HttpHeaders {
    return new HttpHeaders({
      apikey: environment.supabaseKey,
      Authorization: `Bearer ${this.auth.token ?? environment.supabaseKey}`,
    });
  }

  listar(): Observable<Produto[]> {
    if (!this.configurado) return this.configuracaoEmFalta();
    return this.http.get<Produto[]>(this.url, {
      headers: this.headers,
      params: { select: '*', order: 'id' },
    });
  }

  obterPorId(id: number): Observable<Produto> {
    if (!this.configurado) return this.configuracaoEmFalta();
    return this.http.get<Produto>(this.url, {
      headers: this.headers.set('Accept', 'application/vnd.pgrst.object+json'),
      params: { select: '*', id: `eq.${id}` },
    });
  }

  criar(produto: Omit<Produto, 'id'>): Observable<Produto> {
    if (!this.configurado) return this.configuracaoEmFalta();
    return this.http
      .post<Produto[]>(this.url, produto, {
        headers: this.headers.set('Prefer', 'return=representation'),
      })
      .pipe(map((r) => r[0]));
  }

  editar(id: number, produto: Partial<Produto>): Observable<Produto> {
    if (!this.configurado) return this.configuracaoEmFalta();
    return this.http
      .patch<Produto[]>(this.url, produto, {
        headers: this.headers.set('Prefer', 'return=representation'),
        params: { id: `eq.${id}` },
      })
      .pipe(map((r) => r[0]));
  }

  apagar(id: number): Observable<void> {
    if (!this.configurado) return this.configuracaoEmFalta();
    return this.http.delete<void>(this.url, {
      headers: this.headers,
      params: { id: `eq.${id}` },
    });
  }

  mensagemErro(error: unknown): string {
    if (error instanceof Error && error.message.includes('Configuração local')) {
      return error.message;
    }
    if (error instanceof HttpErrorResponse) {
      const body = error.error as { code?: string } | null;
      if (error.status === 401 || error.status === 403 || body?.code === '42501') {
        return 'A operação foi recusada. Inicia sessão com uma conta autorizada.';
      }
      if (error.status === 0) return 'Não foi possível contactar o Supabase. Verifica a ligação.';
    }
    return 'Não foi possível concluir a operação. Verifica os dados e as permissões da base de dados.';
  }

  private configuracaoEmFalta<T>(): Observable<T> {
    return throwError(
      () => new Error('Configuração local do Supabase em falta. Segue os passos do README.')
    );
  }
}