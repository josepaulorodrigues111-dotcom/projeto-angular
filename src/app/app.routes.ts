import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { Produtos } from './pages/produtos/produtos';
import { ProdutoDetalhe } from './pages/produto-detalhe/produto-detalhe';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { ProdutoForm } from './pages/produto-form/produto-form';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'produtos', component: Produtos },
  { path: 'produtos/:id', component: ProdutoDetalhe },
  { path: 'login', component: Login },
  { path: 'admin', component: Dashboard, canActivate: [authGuard] },
  { path: 'admin/novo', component: ProdutoForm, canActivate: [authGuard] },
  { path: 'admin/:id/editar', component: ProdutoForm, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];