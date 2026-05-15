# 👥 Organização da Equipe — Eco Viewer (Back-end)

Este documento define a divisão de responsabilidades entre os integrantes do projeto **Eco Viewer**, com o objetivo de garantir organização, produtividade e aprendizado equilibrado entre os membros.

---

## 📌 Estrutura do Projeto

O projeto segue uma arquitetura baseada em separação de responsabilidades:

src/
├── controllers/
├── routes/
├── services/
├── database/


---

## 👤 Integrantes

- **Jonathan**
- **Yan**

---

## 🧩 Divisão de Responsabilidades

### 🔹 Yan Victor Scopel

Responsável pelas partes mais críticas do sistema:

#### 📁 `services/`
- Implementação das regras de negócio
- Integração com a API externa (Perenual)
- Tratamento e transformação dos dados recebidos
- Lógica de decisão (uso de cache vs chamada externa)

#### 📁 `routes/`
- Definição das rotas da aplicação, para conexão com front-end mais tarde.
- Organização dos endpoints (ex: `/plants`, `/plants/:id`)
- Encaminhamento correto das requisições para os controllers

#### 📁 `controllers/`
- Recebimento das requisições HTTP
- Manipulação de parâmetros (`req.params`, `req.query`, `req.body`)
- Chamada dos services
- Retorno das respostas para o cliente

#### 📁 `config/`
- Responsável pelas configurações gerais da aplicação
- Centralização de variáveis e parâmetros utilizados pelo sistema
- Configuração de conexão com serviços externos, como API e banco de dados
- Definição de portas, URLs, chaves e demais ajustes do ambiente
- Organização de arquivos de configuração para facilitar manutenção e reutilização
- Garantir que parâmetros sensíveis e estruturais fiquem separados da lógica de negócio

---

### 🔹 Jonathan

Responsável pela estrutura de comunicação da API:

#### 📁 `dtos/`
- Definição das estruturas de entrada e saída de dados da aplicação
- Padronização dos dados recebidos em `req.body`, `req.params` e `req.query`
- Padronização do formato de resposta enviado ao cliente
- Criação de tipagens para garantir consistência entre as camadas do sistema
- Apoio na organização e validação dos dados trafegados na aplicação

#### 📁 `entities/`
- Definição das entidades que representam a estrutura dos dados do sistema
- Modelagem dos campos que serão persistidos no banco de dados
- Representação das tabelas e seus atributos
- Organização da estrutura interna dos dados da aplicação
- Apoio na manutenção de consistência entre regra de negócio e persistência

#### 📁 `repositories/`
- Criar e manter os métodos de acesso ao banco de dados
- Implementar consultas e manipulação de dados (CRUD)
- Utilizar as Entities como base para as operações
- Fornecer dados para os services de forma organizada e consistente
- Evitar que controllers ou services acessem o banco diretamente

#### 📁 `database/`
- Configuração da conexão com PostgreSQL
- Modelagem das tabelas
- Criação de queries
- Gerenciamento da persistência de dados



---

## 🔄 Fluxo de Comunicação
    Cliente (Front-end)
            ↓
    Routes
            ↓
    Controller
            ↓
    Service
            ↓
    [ Banco de Dados ] ←→ [ API Perenual ]
            ↓
    Controller
            ↓
    Resposta JSON