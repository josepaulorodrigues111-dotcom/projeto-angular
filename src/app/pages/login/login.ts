import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
      const iniciouSessao = await this.auth.entrar(email, password);
      if (!iniciouSessao) {
        this.erro.set('A conta existe, mas o email ainda não foi confirmado. Verifica a tua caixa de correio.');
        return;
      }
      if (this.auth.erroAutorizacao()) {
        this.erro.set('A sessão foi iniciada, mas não foi possível confirmar as permissões. Tenta novamente mais tarde.');
        return;
      }
      if (this.auth.administrador()) {
        await this.router.navigate(['/admin']);
      } else {
        await this.router.navigate(['/sem-permissao']);
      }
    } catch (error) {
      this.erro.set(this.auth.mensagemErro(error));
    } finally {
      this.aProcessar.set(false);
    }
  }
}
