
import { Component, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Cabecalho } from './components/cabecalho/cabecalho';
import { Rodape } from './components/rodape/rodape';
import { AuthService } from './services/auth.service';

@Component({
  imports: [RouterOutlet, Cabecalho, Rodape],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      if (!this.auth.inicializada()) return;
      const url = this.router.url;
      if (!url.startsWith('/admin')) return;

      if (!this.auth.autenticado()) {
        void this.router.navigate(['/login'], { queryParams: { returnUrl: url } });
      } else if (this.auth.administrador() === false) {
        void this.router.navigate(['/sem-permissao']);
      }
    });
  }
}
