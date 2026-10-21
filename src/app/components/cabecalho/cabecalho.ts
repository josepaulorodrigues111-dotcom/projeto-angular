import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-cabecalho',
  styleUrl: './cabecalho.css',
  templateUrl: './cabecalho.html',
})
export class Cabecalho {}