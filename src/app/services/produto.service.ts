export interface Produto {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  thumbnail: string;
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';

@Injectable({ providedIn: 'root' })
export class ProdutoService {

  private readonly http = inject(HttpClient);

 
  private readonly url = `${API_URL}/produtos`;

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.url);
  }


  obterPorId(id: string): Observable<Produto> {
    return this.http.get<Produto>(`${this.url}/${id}`);
  }

  criar(produto: Omit<Produto, 'id'>): Observable<Produto> {
    return this.http.post<Produto>(this.url, produto);
  }

  editar(id: string, produto: Partial<Produto>): Observable<Produto> {
    return this.http.put<Produto>(`${this.url}/${id}`, produto);
  }

  apagar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}