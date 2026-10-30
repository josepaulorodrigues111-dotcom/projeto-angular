import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recuperar-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './recuperar-password.html',
  styleUrl: './recuperar-password.css',
})
export class RecuperarPassword {
  private readonly auth = inject(AuthService);

  erro = signal('');
  sucesso = signal('');
  aProcessar = signal(false);

  form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  async submeter(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.aProcessar.set(true);
    this.erro.set('');
    this.sucesso.set('');

    try {
      await this.auth.enviarEmailRecuperacao(
        this.form.controls.email.value,
      );

      this.sucesso.set(
        'Se existir uma conta associada a este email, receberás uma mensagem com as instruções para redefinir a palavra-passe.',
      );
    } catch (error) {
      this.erro.set(this.auth.mensagemErro(error));
    } finally {
      this.aProcessar.set(false);
    }
  }
}
