
import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registo',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registo.html',
  styleUrl: './registo.css',
})
export class Registo {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  erro = signal('');
  sucesso = signal('');
  aProcessar = signal(false);

  form = new FormGroup({
    nome: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
    confirmarPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  async submeter(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { nome, email, password, confirmarPassword } =
      this.form.getRawValue();

    if (password !== confirmarPassword) {
      this.erro.set('As palavras-passe não coincidem.');
      return;
    }

    this.aProcessar.set(true);
    this.erro.set('');
    this.sucesso.set('');

    try {
      const sessaoCriada = await this.auth.registar(
        nome.trim(),
        email.trim(),
        password,
      );

      if (sessaoCriada) {
        await this.router.navigateByUrl('/');
      } else {
        this.sucesso.set(
          'Conta criada com sucesso! Verifica o teu email para confirmares a conta antes de iniciares sessão.',
        );

        this.form.reset();
      }
    } catch (error) {
      this.erro.set(this.auth.mensagemErro(error));
    } finally {
      this.aProcessar.set(false);
    }
  }
}
