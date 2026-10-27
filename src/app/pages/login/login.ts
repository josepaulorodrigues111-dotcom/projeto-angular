import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
        this.erro.set('Não foi possível iniciar sessão. Confirma o email da conta.');
        return;
      }

      // Volta ao sítio onde o utilizador estava (só caminhos internos)
      const destino = this.route.snapshot.queryParamMap.get('returnUrl');
      if (destino && destino.startsWith('/') && !destino.startsWith('//')) {
        await this.router.navigateByUrl(destino);
      } else {
        await this.router.navigateByUrl(this.auth.eAdmin() ? '/admin' : '/');
      }
    } catch (error) {
      this.erro.set(this.auth.mensagemErro(error));
    } finally {
      this.aProcessar.set(false);
    }
  }
}