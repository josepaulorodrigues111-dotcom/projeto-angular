import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rodape',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './rodape.html',
  styleUrl: './rodape.css',
})
export class Rodape {
  ano = new Date().getFullYear();

  irParaTopo(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
