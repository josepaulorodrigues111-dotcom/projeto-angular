import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProdutoInterface } from '../models/produto';
import { API_URL } from '../api.config';

@Injectable({ providedIn: 'root' })
export class ProdutoService {

  private readonly http = inject(HttpClient);

 
  private readonly url = `${API_URL}/produtos`;

  listar(): Observable<ProdutoInterface[]> {
    return this.http.get<ProdutoInterface[]>(this.url);
  }


  obterPorId(id: string): Observable<ProdutoInterface> {
    return this.http.get<ProdutoInterface>(`${this.url}/${id}`);
  }

  criar(produto: Omit<ProdutoInterface, 'id'>): Observable<ProdutoInterface> {
    return this.http.post<ProdutoInterface>(this.url, produto);
  }

  editar(id: string, produto: Partial<ProdutoInterface>): Observable<ProdutoInterface> {
    return this.http.put<ProdutoInterface>(`${this.url}/${id}`, produto);
  }

  apagar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}