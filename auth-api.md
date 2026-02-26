# Authentication API Service

## Lógica de negócio
* Uma empresa (company) pode ter vários grupos (groups).
* Cada grupo (group) pertence a uma única empresa (companyId em groups).
* Cada usuário (user) pertence a uma única empresa (companyId em users) e a um único grupo (groupId em users).
* Não há tabela user_group, pois a relação usuário-grupo é gerenciada diretamente pelo campo groupId na tabela users.

## Especificações para dados:
* Todos os campos serão armazenados da forma que foram escritas, respeitando-se:
  * Letras maiúsculas.
  * Letras minúsculas.
  * Acentos.
  * Números.
  * Espaços.
  * Caracteres especiais: ! @ # $ % ^ & * ( ) - _ + =

## Estrutura do banco de dados:
### Tabela company
```
CREATE TABLE company (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  ein TEXT UNIQUE NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  deletedAt DATETIME
);
```

### Tabela groups
```
CREATE TABLE groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  companyId INTEGER NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  deletedAt DATETIME,
  FOREIGN KEY (companyId) REFERENCES company(id),
  UNIQUE(name, companyId)
);
```

### Tabela users
```
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  age INTEGER NOT NULL,
  companyId INTEGER NOT NULL,
  groupId INTEGER NOT NULL,
  password TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  deletedAt DATETIME,
  FOREIGN KEY (companyId) REFERENCES company(id),
  FOREIGN KEY (groupId) REFERENCES groups(id),
  UNIQUE(email)
);
```
## Comportamento esperado:
### Gerenciando de empresas:
* Ao criar uma nova empresa, deve-se validar:
  * Se o usuário está logado e pertence ao grupo Admin da empresa principal.
  * Se o campo ein é único em toda a tabela.
* Ao editar uma empresa:
  * Serão permitidos apenas os campos name e surname.
* Ao deletar uma empressa, ocorre um soft delete em todos os grupos e usuários que pertencem à empresa.
* Endpoints devem respeitar a hieraquia /company:

|Método|URL|Descrição|
|-|-|-|
| POST  | /company/ | Criar uma nova empresa. |
| GET   | /company/ | Listar todos as empresas (com paginação e opção includeDeleted). |
| GET   | /company/:companyId | Obter uma empresa por seu ID. |
| GET   | /company/ein/:companyId | Obter uma empresa por seu EIN. |
| PATCH | /company/:companyId | Atualizar uma empresa (name e surname). |
| DELETE| /company/:companyId | Soft deletar uma empresa. |
| PATCH | /company/:companyId/restore | Restaurar uma empresa soft deletada. |

### Gerenciamento de grupos
* Ao criar um grupo deve-se validar:
  * Se o usuário está logado e pertence ao grupo Admin da empresa.
  * Que companyId exista e não está deletada (soft delete).
  * Que o par name e companyId seja único em toda a tabela.
* Ao editar um grupo:
  * Serão permitidos apenas o campo name.
* Ao deletar uma empresa, ocorre um soft delete em todo os usuários que pertencem ao grupo.
* Endpoints devem respeitar a hierarquia /company/:companyId/groups.

|Método|URL|Descrição|
|-|-|-|
| POST  | /company/:companyId/groups | Criar um novo grupo. |
| GET   | /company/:companyId/groups | Listar todos os grupo da empresa (com paginação e opção includeDeleted). |
| GET   | /company/:companyId/groups/:groupId | Obter um grupo por seu ID. |
| PATCH | /company/:companyId/groups/:groupId | Atualizar um grupo (name). |
| DELETE| /company/:companyId/groups/:groupId | Soft deletar um grupo. |
| PATCH | /company/:companyId/groups/:groupId/restore | Restaurar um grupo soft deletado. |


### Gerenciando de usuários:
* Ao criar um usuário, deve-se validar:
  * Se o usuário está logado e pertence ao grupo Admin da empresa.
  * Que companyId e groupId existem e não estão deletado (soft delete).
  * Que groupId pertence à empresa especificada (groups.companyId = users.companyId).
  * Que email é único em toda a tabela.
* Ao editar um usuário:
  * Serão permitidos apenas os campos name, phone, groupId e password.
  * Serão permitidos apenas grupos que perteçam à empresa.
* Ao deletar um usuário, ocorre um soft delete informado no campo deletedAt.
* Endpoints devem respeitar a hierarquia /company/:companyId/users.

|Método|URL|Descrição|
|-|-|-|
| POST  | /company/:companyId/users | Criar um novo usuário.|
| GET   | /company/:companyId/users | Listar todos os usuários da empresa (com paginação e opção includeDeleted).|
| GET   | /company/:companyId/users/:userId | Obter um usuário por seu ID.|
| PATCH | /company/:companyId/users/:userId | Atualizar um usuário (nome, telefone, grupo, senha).|
| DELETE| /company/:companyId/users/:userId | Soft deletar um usuário.|
| PATCH | /company/:companyId/users/:userId/restore | Restaurar um usuário soft deletado.|

## Etapas de codificação:
|Item|Progresso||
|-|-|-|
| Estrutura do Banco de Dados | <meter value="100" min="0" max="100" low="30" high="95" optimum="100"></meter>| 100% |
| Gerenciamento de Empresas | <meter value="70" min="0" max="100" low="30" high="95" optimum="100"></meter>| 100% |
| Gerenciamento de Grupos | <meter value="70" min="0" max="100" low="30" high="95" optimum="100"></meter>| 70% |
| Gerenciamento de Usuários | <meter value="50" min="0" max="100" low="30" high="95" optimum="100"></meter>| 50% |
| Endpoints | <meter value="60" min="0" max="100" low="30" high="95" optimum="100"></meter>| 60% |
| <b>Total</b> | <meter value="70" min="0" max="100" low="30" high="95" optimum="100"></meter> | 70% |
