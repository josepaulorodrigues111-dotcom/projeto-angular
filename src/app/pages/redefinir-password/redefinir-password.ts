
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
  selector: 'app-redefinir-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './redefinir-password.html',
  styleUrl: './redefinir-password.css',
})
export class RedefinirPassword {
  private readonly auth = inject(AuthService);

  erro = signal('');
  sucesso = signal('');
  aProcessar = signal(false);

  form = new FormGroup({
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

    const { password, confirmarPassword } = this.form.getRawValue();

    if (password !== confirmarPassword) {
      this.erro.set('As palavras-passe não coincidem.');
      return;
    }

    this.aProcessar.set(true);
    this.erro.set('');
    this.sucesso.set('');

    try {
      // Esperar que o Supabase recupere a sessão.
      await this.auth.aguardarSessao();

      if (!this.auth.autenticado()) {
        this.erro.set(
          'A ligação de recuperação é inválida ou expirou. Solicita uma nova ligação.',
        );
        return;
      }

      await this.auth.redefinirPassword(password);

      // Terminar a sessão depois de alterar a palavra-passe.
      await this.auth.sair();

      this.sucesso.set(
        'A palavra-passe foi alterada com sucesso. Já podes iniciar sessão.',
      );

      this.form.reset();
    } catch (error) {
      this.erro.set(this.auth.mensagemErro(error));
    } finally {
      this.aProcessar.set(false);
    }
  }
}
