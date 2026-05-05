#  Teste Técnico - Processamento de Logs

## Descrição

Aplicação em **Node.js + TypeScript** que processa um arquivo `data.json` contendo registros de tarefas e gera um relatório consolidado (`result.json`).

---

## Estratégia

Os dados são processados utilizando estruturas como:

- `Record`
- `Map`
- `Array.sort`

Para garantir performance e organização dos dados.

---

## Tecnologias utilizadas

* ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
* ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
* ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## Funcionalidades

A aplicação realiza:

* ✔ Soma total de minutos (`totalMinutes`)
* ✔ Agrupamento de tarefas por `taskId`
* ✔ Ordenação por tarefas mais trabalhadas
* ✔ Cálculo de percentual por tarefa
* ✔ Top 3 tarefas com maior percentual
* ✔ Top 3 usuários com mais tempo trabalhado
* ✔ Usuário com maior número de tarefas distintas
* ✔ Contagem de registros inválidos

---

## Como executar com Docker

### Pré-requisitos

* Docker instalado

### Rodar aplicação

```bash
docker compose up --build
```

---

## 📁 Entrada

Arquivo:

```bash
data.json
```

---

## 📁 Saída

Arquivo gerado automaticamente:

```bash
result.json
```

---

## Observações

* A aplicação não requer execução manual adicional
* Todo o processamento ocorre automaticamente ao subir o container
* O resultado é salvo na raiz do projeto

---

##  Autor

Maryana Santos de Carvalhoxx'

