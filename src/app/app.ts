
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cabecalho } from './components/cabecalho/cabecalho';
import { Rodape } from './components/rodape/rodape';

@Component({
  imports: [RouterOutlet, Cabecalho, Rodape],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
