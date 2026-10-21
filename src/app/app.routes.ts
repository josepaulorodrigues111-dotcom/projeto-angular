import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Produtos } from './pages/produtos/produtos';
import { ProdutoDetalhe } from './pages/produto-detalhe/produto-detalhe';
import { ProdutoForm } from './pages/produto-form/produto-form';

export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'produtos', component: Produtos },
  { path: 'produtos/novo', component: ProdutoForm },
  { path: 'produtos/:id', component: ProdutoDetalhe },
  { path: 'produtos/:id/editar', component: ProdutoForm },
];