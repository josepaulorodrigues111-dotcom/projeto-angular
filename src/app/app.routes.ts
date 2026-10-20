import { Routes } from '@angular/router';
import { Produtos } from './pages/produtos/produtos';

export const routes: Routes = [
  { path: '', redirectTo: 'produtos', pathMatch: 'full' },
  { path: 'produtos', component: Produtos },
];