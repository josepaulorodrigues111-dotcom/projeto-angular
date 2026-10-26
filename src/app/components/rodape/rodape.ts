import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-rodape',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './rodape.html',
  styleUrl: './rodape.css',
})
export class Rodape {
  private readonly router = inject(Router);

  ano = new Date().getFullYear();

  irParaTopo(): void {
    this.router.events
      .pipe(
        filter((evento) => evento instanceof NavigationEnd),
      )
      .subscribe(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      });

    // Se já estiveres na página de destino, sobe imediatamente de forma suave.
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
