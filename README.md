# ShopManager

Aplicação Angular de catálogo e gestão de produtos. Os visitantes podem consultar o catálogo; a administração requer uma sessão Supabase e autorização explícita registada na base de dados.

## Tecnologias

- Angular 22, TypeScript e componentes standalone
- Angular Router, formulários reativos, signals e pipes nativos
- Supabase Auth e tabela `public.produtos`
- `HttpClient` num serviço para os pedidos REST do Supabase; `@supabase/supabase-js` para autenticação e verificação da permissão administrativa
- GitHub Actions e GitHub Pages

## Funcionalidades

- Página inicial com produtos em destaque
- Catálogo público com pesquisa e filtro por categoria
- Cartões reutilizáveis, detalhes, preço e estado de stock
- Dashboard com estatísticas, criação, edição e eliminação de produtos
- Login reservado a contas previamente criadas e autorizadas
- Sem registo público na aplicação

O endereço público do GitHub Pages não está confirmado neste repositório. Depois de uma publicação bem-sucedida, acrescenta aqui o URL apresentado pelo ambiente `github-pages` no GitHub.

## Executar localmente

Requer Node.js compatível com Angular 22 e npm.

```bash
npm ci
```

Executa `npm start` (ou `ng serve`). A configuração local continua no ficheiro ignorado pelo Git `src/environments/environment.development.ts`; o Angular seleciona-o automaticamente na configuração `development`. Mantém nesse ficheiro a URL do projeto e uma chave pública anon/publishable. Não é necessário criar `.env.local` nem gerar outros ficheiros. Nunca uses uma chave `service_role` ou `sb_secret_` no frontend. A proteção dos dados depende das políticas RLS no Supabase.

Comandos adicionais:

```bash
npm run build
npm test -- --watch=false --isolate=false
```

## Supabase: esquema e autorização

A aplicação espera uma tabela `public.produtos` com os campos compatíveis com `src/app/models/produto.ts`: `id`, `title`, `description`, `price`, `category`, `stock` e `thumbnail`. A leitura do catálogo é pública. A escrita deve ser limitada pela base de dados.

Antes de aplicar SQL, consulta no SQL Editor:

```sql
select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'produtos';

select n.nspname as schema_name, c.relname as table_name,
       c.relrowsecurity as rls_enabled, c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname = 'produtos';
```

O ficheiro [`supabase/admin-access.sql`](supabase/admin-access.sql) prepara uma tabela privada `shop_manager_private.administradores`, uma função `public.shop_manager_is_admin()` e políticas RLS para leitura pública e escrita administrativa. **A migração aborta se já existirem políticas em `public.produtos`**: analisa-as e adapta a migração antes de executar, sem as apagar ou substituir às cegas. Também aborta se o schema ou a função privada já existirem, para evitar colisões, e confirma que a tabela esperada existe.

Executa a migração revista no SQL Editor do projeto Supabase. Depois:

1. Cria cada conta em **Authentication** no painel Supabase. Desativa a criação pública de contas nas definições de Supabase Auth; essa configuração remota não é alterada por este repositório.
2. Copia o UUID da conta e insere-o na lista privada pelo SQL Editor:

   ```sql
   insert into shop_manager_private.administradores (user_id)
   values ('<UUID_DO_UTILIZADOR>')
   on conflict (user_id) do nothing;
   ```

3. Para remover autorização, executa `delete from shop_manager_private.administradores where user_id = '<UUID_DO_UTILIZADOR>';`.
4. Testa a leitura como visitante e tenta `INSERT`, `UPDATE` e `DELETE` como visitante e como utilizador autenticado sem autorização. As três escritas têm de ser recusadas; uma conta listada como administradora deve conseguir gerir produtos.

## GitHub Pages

O workflow `.github/workflows/main.yml` publica o build em `/projeto-angular/`, cria `404.html` para rotas profundas e espera os GitHub Secrets `SUPABASE_URL` e `SUPABASE_KEY` no ambiente `github-pages`. A chave tem de ser pública anon/publishable. A validação do workflow rejeita uma chave `service_role`/`sb_secret_` e URL inválido, sem imprimir os valores.

Antes do build de produção, o workflow valida os Secrets e prepara `src/environments/environment.ts` no runner a partir deles. Esse ficheiro é sobrescrito só durante o job e não altera o checkout nem exige credenciais versionadas. Não coloques credenciais no código versionado. Depois da publicação, confirma o resultado do workflow, o URL de Pages, catálogo, imagens e carregamento direto de rotas internas. A publicação e os Secrets remotos ainda não foram confirmados.

