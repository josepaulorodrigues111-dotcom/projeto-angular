import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { Produtos } from './pages/produtos/produtos';
import { ProdutoDetalhe } from './pages/produto-detalhe/produto-detalhe';
import { Dashboard } from './pages/dashboard/dashboard';
import { ProdutoForm } from './pages/produto-form/produto-form';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'produtos', component: Produtos },
  { path: 'produtos/:id', component: ProdutoDetalhe },
  { path: 'admin', component: Dashboard },
  { path: 'admin/novo', component: ProdutoForm },
  { path: 'admin/:id/editar', component: ProdutoForm },
  { path: '**', redirectTo: '' },
];