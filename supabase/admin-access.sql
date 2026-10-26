-- ShopManager: modelo de autorização de administradores.
-- Antes de executar, confirma que public.produtos existe e revê as políticas
-- atuais. Este script aborta se encontrar políticas existentes, para evitar
-- combinar permissões antigas com novas políticas permissivas (OR).

begin;

do $$
begin
  if to_regclass('public.produtos') is null then
    raise exception 'A tabela public.produtos não existe. Confirma o esquema antes de aplicar esta migração.';
  end if;

  if exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'produtos'
  ) then
    raise exception 'Existem políticas em public.produtos. Revê-as e adapta a migração antes de continuar.';
  end if;

  if exists (select 1 from pg_namespace where nspname = 'shop_manager_private') then
    raise exception 'O schema shop_manager_private já existe. Inspeciona-o antes de adaptar a migração.';
  end if;

  if to_regprocedure('public.shop_manager_is_admin()') is not null then
    raise exception 'A função public.shop_manager_is_admin() já existe. Inspeciona-a antes de adaptar a migração.';
  end if;
end;
$$;

create schema shop_manager_private;
revoke all on schema shop_manager_private from public, anon, authenticated;

create table shop_manager_private.administradores (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table shop_manager_private.administradores enable row level security;
revoke all on table shop_manager_private.administradores from public, anon, authenticated;

create function public.shop_manager_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from shop_manager_private.administradores as administrators
    where administrators.user_id = (select auth.uid())
  );
$$;

revoke all on function public.shop_manager_is_admin() from public, anon;
grant execute on function public.shop_manager_is_admin() to authenticated;

alter table public.produtos enable row level security;

revoke all on table public.produtos from public, anon, authenticated;
grant select on table public.produtos to anon, authenticated;
grant insert, update, delete on table public.produtos to authenticated;
revoke insert, update, delete on table public.produtos from public, anon;

do $$
declare
  sequence_name text;
begin
  for sequence_name in
    select pg_get_serial_sequence('public.produtos', c.column_name)
    from information_schema.columns as c
    where c.table_schema = 'public'
      and c.table_name = 'produtos'
      and pg_get_serial_sequence('public.produtos', c.column_name) is not null
  loop
    execute format(
      'grant usage, select on sequence %s to authenticated',
      sequence_name::regclass
    );
  end loop;
end;
$$;

create policy produtos_public_read
  on public.produtos for select to anon, authenticated
  using (true);

create policy produtos_admin_insert
  on public.produtos for insert to authenticated
  with check ((select public.shop_manager_is_admin()));

create policy produtos_admin_update
  on public.produtos for update to authenticated
  using ((select public.shop_manager_is_admin()))
  with check ((select public.shop_manager_is_admin()));

create policy produtos_admin_delete
  on public.produtos for delete to authenticated
  using ((select public.shop_manager_is_admin()));

commit;

-- Cria uma conta em Authentication > Users e autoriza-a pelo SQL Editor:
-- insert into shop_manager_private.administradores (user_id)
-- values ('<UUID_DO_UTILIZADOR>') on conflict (user_id) do nothing;
