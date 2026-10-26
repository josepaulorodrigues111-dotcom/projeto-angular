import { describe, expect, it } from 'vitest';
import { routes } from './app.routes';
import { authGuard } from './guards/auth.guard';

describe('routes', () => {
  it('mantém o catálogo público e protege todas as rotas de administração', () => {
    expect(routes.find((route) => route.path === '')?.canActivate).toBeUndefined();
    expect(routes.find((route) => route.path === 'produtos')?.canActivate).toBeUndefined();
    expect(routes.find((route) => route.path === 'produtos/:id')?.canActivate).toBeUndefined();

    for (const path of ['admin', 'admin/novo', 'admin/:id/editar']) {
      expect(routes.find((route) => route.path === path)?.canActivate).toContain(authGuard);
    }
  });
});
