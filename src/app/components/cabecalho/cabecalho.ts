import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CarrinhoService } from '../../services/carrinho.service';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-cabecalho',
  styleUrl: './cabecalho.css',
  templateUrl: './cabecalho.html',
})
export class Cabecalho {
  readonly auth = inject(AuthService);
  readonly carrinho = inject(CarrinhoService);
  private readonly router = inject(Router);

  erroSair = '';
  menuAberto = false;

  get nomeUtilizador(): string {
    return (
      this.auth.sessao()?.user.user_metadata?.['full_name'] ||
      this.auth.email ||
      'Utilizador'
    );
  }

  alternarMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  fecharMenu(): void {
    this.menuAberto = false;
  }

  async sair(): Promise<void> {
    this.erroSair = '';
    this.fecharMenu();

    try {
      await this.auth.sair();
      this.carrinho.limpar();
      await this.router.navigate(['/']);
    } catch (error) {
      this.erroSair = this.auth.mensagemErro(error);
    }
  }
}
