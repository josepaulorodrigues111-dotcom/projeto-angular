import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Qualquer utilizador autenticado (carrinho)
export const authGuard: CanActivateFn = async (_rota, estado) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.aguardarSessao();

  return auth.autenticado()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { returnUrl: estado.url } });
};

// Só o administrador (/admin)
export const adminGuard: CanActivateFn = async (_rota, estado) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.aguardarSessao();

  if (!auth.autenticado()) {
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: estado.url } });
  }

  return auth.eAdmin() ? true : router.createUrlTree(['/']);
};