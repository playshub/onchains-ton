
# Onchains TON

`Onchains TON` is a blockchain indexing solution designed to track transactions of specific addresses and categorize them efficiently. This project focuses on extracting and organizing data from the TON blockchain to support detailed analysis and transaction management.

- `postgres`: PostgreSQL server to store indexed data and perform queries.
- `indexer-worker`: TON Index worker to read and parse data via [TON API Center](https://toncenter.com/)
- `webhooks`: Send parsed transactions through webhooks.

# Feature

- Index and monitor TON transactions for specific addresses.
- Categorize transactions by type, address, or metadata for streamlined queries.
- Scalable and optimized for high-volume transaction indexing.

# Technique

- NestJS: Handles indexing operations, parsing TON transactions, and serving API endpoints.
- Postgres: PostgreSQL server to store transaction data and perform queries.
- TON client: Connect to TON HTTP API endpoint to get payment transaction

# How to run

## Running locally

- Prerequisite: `Docker` and `Docker Compose`. Install via [download link](https://docs.docker.com/compose/install/).

```shell
docker compose up -d --build

```

# Project Structure

```
playshub-blockchain/
├── src/
│   ├── migrations/
│   ├── modules/
│   │   ├── crons/
│   │   ├── observer-accounts/
│   │   ├── parser/
│   │   ├── playshub-transactions/
│   │   ├── resync/
│   │   ├── sync/
│   │   ├── ton-api/
│   │   └── webhook/
│   ├── utils/
│   ├── types/
│   ├── app.controller.ts
│   ├── app.module.ts
│   └── main.ts
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

- `src/`:` Contains the source code, including components and styles.
- `migrations/`: Contains database TypeORM migrations scripts
- `modules/crons`: Running intervals to catching lastest transaction
- `modules/observer-accounts`: Store list of observer accounts
- `modules/parser`: Parsing & category transaction
- `modules/playshub-transactions`: Store list of transactions
- `modules/resync`: Handle resync operation for specific accounts
- `modules/sync`: Syncing transaction
- `modules/ton-api`: TON client
- `modules/notification`: Send `webhook` for service listeners
- `utils/`: Contains utility functions, classes, and other helper modules that are used throughout the project
- `main.ts`: Entry point for the React application.

# Authors and acknowledgment

Playshub Team

# License

This project is licensed under the MIT License. See the LICENSE file for details.

# Project status

We are still developing this project following the roadmap in here: https://onchains.ai/