
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient | null = null;

  get configurado(): boolean {
    return Boolean(environment.supabaseUrl && environment.supabaseKey);
  }

  get client(): SupabaseClient | null {
    if (!this.configurado) return null;
    if (!this.supabase) {
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }
    return this.supabase;
  }
}
