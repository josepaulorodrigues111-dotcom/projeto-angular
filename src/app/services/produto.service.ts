import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Produto } from '../models/produto';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly url = `${environment.supabaseUrl}/rest/v1/produtos`;

  // Sem sessão usa a chave pública (leitura); com sessão usa o token do utilizador (escrita)
  private get headers(): HttpHeaders {
    return new HttpHeaders({
      apikey: environment.supabaseKey,
      Authorization: `Bearer ${this.auth.token ?? environment.supabaseKey}`,
    });
  }

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.url, {
      headers: this.headers,
      params: { select: '*', order: 'id' },
    });
  }

  obterPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(this.url, {
      headers: this.headers.set('Accept', 'application/vnd.pgrst.object+json'),
      params: { select: '*', id: `eq.${id}` },
    });
  }

  criar(produto: Omit<Produto, 'id'>): Observable<Produto> {
    return this.http
      .post<Produto[]>(this.url, produto, {
        headers: this.headers.set('Prefer', 'return=representation'),
      })
      .pipe(map((r) => r[0]));
  }

  editar(id: number, produto: Partial<Produto>): Observable<Produto> {
    return this.http
      .patch<Produto[]>(this.url, produto, {
        headers: this.headers.set('Prefer', 'return=representation'),
        params: { id: `eq.${id}` },
      })
      .pipe(map((r) => r[0]));
  }

  apagar(id: number): Observable<void> {
    return this.http.delete<void>(this.url, {
      headers: this.headers,
      params: { id: `eq.${id}` },
    });
  }
}