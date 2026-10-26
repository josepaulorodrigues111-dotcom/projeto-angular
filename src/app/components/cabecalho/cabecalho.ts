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

  async sair(): Promise<void> {
    await this.auth.sair();
    this.router.navigate(['/']);
  }
}