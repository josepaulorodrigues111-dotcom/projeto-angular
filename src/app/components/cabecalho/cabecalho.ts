import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [RouterLink],
  selector: 'app-cabecalho',
  styleUrl: './cabecalho.css',
  templateUrl: './cabecalho.html',
})
export class Cabecalho {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  erroSair = '';

  async sair(): Promise<void> {
    this.erroSair = '';
    try {
      await this.auth.sair();
      await this.router.navigate(['/']);
    } catch (error) {
      this.erroSair = this.auth.mensagemErro(error);
    }
  }
}
