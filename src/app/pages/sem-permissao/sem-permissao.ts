import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sem-permissao',
  imports: [RouterLink],
  templateUrl: './sem-permissao.html',
  styleUrl: './sem-permissao.css',
})
export class SemPermissao {
  readonly auth = inject(AuthService);
}
