
import { Injectable, inject } from '@angular/core';
import { from } from 'rxjs';
import { SupabaseService } from './supabase';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {
  private readonly supabaseService = inject(SupabaseService);

  listar() {
    return from(
      this.supabaseService.client
        .from('produtos')
        .select('*')
        .order('id')
    );
  }
}
