import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { Produto } from '../../models/produto';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly carrinhoService = inject(CarrinhoService);

  private readonly chaveProdutoPendente = 'produtoPendenteCarrinho';

  erro = signal('');
  aProcessar = signal(false);

  form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  async submeter(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();

    this.aProcessar.set(true);
    this.erro.set('');

    try {
      await this.auth.entrar(email, password);

      if (!this.auth.autenticado()) {
        this.erro.set(
          'Não foi possível iniciar sessão. Confirma o email da conta.',
        );
        return;
      }

      // Se o utilizador tentou adicionar um produto antes do login,
      // adicioná-lo agora que a sessão está iniciada.
      const produtoPendente = this.obterProdutoPendente();

      if (produtoPendente) {
        this.carrinhoService.adicionar(produtoPendente);

        await this.router.navigateByUrl('/carrinho');
        return;
      }

      // Comportamento normal do login, quando não existe produto pendente.
      const destino = this.route.snapshot.queryParamMap.get('returnUrl');

      if (destino && destino.startsWith('/') && !destino.startsWith('//')) {
        await this.router.navigateByUrl(destino);
      } else {
        await this.router.navigateByUrl(
          this.auth.eAdmin() ? '/admin' : '/',
        );
      }
    } catch (error) {
      this.erro.set(this.auth.mensagemErro(error));
    } finally {
      this.aProcessar.set(false);
    }
  }

  private obterProdutoPendente(): Produto | null {
    try {
      const texto = sessionStorage.getItem(this.chaveProdutoPendente);

      if (!texto) {
        return null;
      }

      // Remover o produto pendente para não o adicionar novamente
      // numa futura tentativa de login.
      sessionStorage.removeItem(this.chaveProdutoPendente);

      const produto: unknown = JSON.parse(texto);

      if (
        typeof produto !== 'object' ||
        produto === null ||
        !('id' in produto) ||
        !('title' in produto) ||
        !('price' in produto) ||
        !('stock' in produto) ||
        typeof produto.id !== 'number' ||
        typeof produto.title !== 'string' ||
        typeof produto.price !== 'number' ||
        typeof produto.stock !== 'number' ||
        produto.stock <= 0
      ) {
        return null;
      }

      return produto as Produto;
    } catch {
      return null;
    }
  }
}
