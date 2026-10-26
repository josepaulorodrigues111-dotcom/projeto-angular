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

  modoRegisto = signal(false);
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

  alternarModo(): void {
    this.modoRegisto.update((v) => !v);
    this.erro.set('');
  }

  async submeter(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.aProcessar.set(true);
    this.erro.set('');

    try {
      if (this.modoRegisto()) {
        await this.auth.registar(email, password);
      } else {
        await this.auth.entrar(email, password);
      }
      this.router.navigate(['/admin']);
    } catch {
      this.erro.set('Não foi possível concluir. Verifica os dados e tenta novamente.');
    } finally {
      this.aProcessar.set(false);
    }
  }
}