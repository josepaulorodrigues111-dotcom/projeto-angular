# ShopManager — Gestão de Produtos

## 1. Descrição do projeto

O **ShopManager** é uma aplicação web desenvolvida com Angular e TypeScript para a consulta e gestão de produtos. O projeto foi desenvolvido no âmbito do módulo de Fundamentos de Angular, com o objetivo de aplicar os conceitos da framework através de uma aplicação SPA (Single Page Application).

## 2. Principais funcionalidades

- Consulta da lista de produtos.
- Pesquisa de produtos por nome.
- Filtragem de produtos por categoria.
- Visualização dos detalhes de cada produto.
- Dashboard com indicadores sobre os produtos e o stock.
- Autenticação de utilizadores através do Supabase Auth.
- Criação, edição e eliminação de produtos por administradores autorizados.
- Formulários com validação dos dados.
- Controlo de permissões através das políticas de segurança da base de dados.

## 3. Aplicação publicada

A aplicação está disponível através do GitHub Pages:

[**Aceder ao Projeto **](https://josepaulorodrigues111-dotcom.github.io/projeto-angular/)

Repositório do projeto: [GitHub — projeto-angular](https://github.com/josepaulorodrigues111-dotcom/projeto-angular)

## 4. Instalação e execução local

### Pré-requisitos

- [Node.js](https://nodejs.org/)
- npm, incluído com o Node.js
- Acesso ao projeto Supabase utilizado pela aplicação

### Passos de instalação

**1. Clonar o repositório**

```bash
git clone https://github.com/josepaulorodrigues111-dotcom/projeto-angular.git
cd projeto-angular
```

**2. Instalar as dependências**

```bash
npm ci
```

**3. Configurar o ambiente**

Configurar os ficheiros de ambiente locais com o URL do projeto Supabase e a respetiva chave pública (`anon` ou `publishable`), de acordo com a configuração da aplicação.

Não devem ser utilizadas chaves secretas ou `service_role` no código do frontend, nem enviados para o GitHub ficheiros com credenciais privadas.

**4. Iniciar a aplicação**

```bash
npm start
```

A aplicação ficará normalmente disponível em:

[http://localhost:4200/](http://localhost:4200/)

## 5. API e fonte de dados

A aplicação utiliza o **Supabase** como fonte de dados para armazenar e consultar os produtos. O Supabase Auth é utilizado para a autenticação, enquanto as permissões de administração são verificadas através da configuração de segurança da base de dados.

A comunicação com os dados é realizada através de pedidos HTTP, utilizando o `HttpClient` do Angular.
