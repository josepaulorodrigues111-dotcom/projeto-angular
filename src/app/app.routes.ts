import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/inicio/inicio').then((m) => m.Inicio) },
  { path: 'produtos', loadComponent: () => import('./pages/produtos/produtos').then((m) => m.Produtos) },
  { path: 'produtos/:id', loadComponent: () => import('./pages/produto-detalhe/produto-detalhe').then((m) => m.ProdutoDetalhe) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then((m) => m.Login) },
  { path: 'carrinho', loadComponent: () => import('./pages/carrinho/carrinho').then((m) => m.Carrinho), canActivate: [authGuard] },
  { path: 'admin', loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard), canActivate: [adminGuard] },
  { path: 'admin/novo', loadComponent: () => import('./pages/produto-form/produto-form').then((m) => m.ProdutoForm), canActivate: [adminGuard] },
  { path: 'admin/:id/editar', loadComponent: () => import('./pages/produto-form/produto-form').then((m) => m.ProdutoForm), canActivate: [adminGuard] },
  { path: '**', redirectTo: '' },
];