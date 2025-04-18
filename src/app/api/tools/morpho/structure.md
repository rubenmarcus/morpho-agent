# Morpho Labs API Structure

## Overview
This API provides integration with the Morpho Labs protocol, enabling interactions with Morpho Vaults (Earn) and Morpho Markets (Borrow) on Ethereum. The API supports data queries via GraphQL and transaction execution on the blockchain.

## Directory Structure

```
/src/app/api/tools/morpho/
├── earn/
│   ├── deposit/
│   │   └── route.ts         # API for vault deposits
│   ├── withdraw/
│   │   └── route.ts         # API for vault withdrawals
│   ├── claim-rewards/
│   │   └── route.ts         # API for claiming rewards
│   └── get-vaults/
│       └── route.ts         # API for listing available vaults
├── borrow/
│   ├── supply-collateral/
│   │   └── route.ts         # API for supplying collateral
│   ├── borrow/
│   │   └── route.ts         # API for taking loans
│   ├── repay/
│   │   └── route.ts         # API for repaying loans
│   ├── withdraw-collateral/
│   │   └── route.ts         # API for withdrawing collateral
│   └── get-markets/
│       └── route.ts         # API for listing available markets
├── data/
│   ├── get-apy/
│   │   └── route.ts         # API for querying APYs
│   ├── get-user-positions/
│   │   └── route.ts         # API for querying user positions
│   ├── get-vault-metrics/
│   │   └── route.ts         # API for vault metrics
│   └── get-market-metrics/
│       └── route.ts         # API for market metrics
└── utils/
    ├── graphql.ts           # Utilities for GraphQL queries
    ├── transaction.ts       # Utilities for transactions
    └── types.ts             # Type definitions
```

## API Endpoints

### Earn (Vaults)

#### 1. Vault Deposits
- **Endpoint**: `/api/tools/morpho/earn/deposit`
- **Method**: GET
- **Parameters**:
  - `vaultAddress`: Vault address
  - `amount`: Amount of tokens to deposit
  - `receiver`: (Optional) Recipient address
- **Description**: Generates payload for depositing tokens in a Morpho vault

#### 2. Vault Withdrawals
- **Endpoint**: `/api/tools/morpho/earn/withdraw`
- **Method**: GET
- **Parameters**:
  - `vaultAddress`: Vault address
  - `amount`: Amount of tokens to withdraw
  - `receiver`: (Optional) Recipient address
- **Description**: Generates payload for withdrawing tokens from a Morpho vault

#### 3. Claim Rewards
- **Endpoint**: `/api/tools/morpho/earn/claim-rewards`
- **Method**: GET
- **Parameters**:
  - `account`: Account address
  - `claimable`: Claimable amount
  - `proof`: Merkle proof
- **Description**: Generates payload for claiming vault rewards

#### 4. List Vaults
- **Endpoint**: `/api/tools/morpho/earn/get-vaults`
- **Method**: GET
- **Parameters**:
  - `first`: (Optional) Number of results
  - `orderBy`: (Optional) Field to order by
  - `orderDirection`: (Optional) Order direction
- **Description**: Returns list of available vaults

### Borrow (Markets)

#### 1. Supply Collateral
- **Endpoint**: `/api/tools/morpho/borrow/supply-collateral`
- **Method**: GET
- **Parameters**:
  - `marketParams`: Market parameters
  - `assets`: Amount of tokens to supply as collateral
  - `onBehalf`: (Optional) Address to supply on behalf of
- **Description**: Generates payload for supplying collateral in a Morpho market

#### 2. Take Loan
- **Endpoint**: `/api/tools/morpho/borrow/borrow`
- **Method**: GET
- **Parameters**:
  - `marketParams`: Market parameters
  - `assets`: Amount of tokens to borrow
  - `shares`: (Optional) Amount of shares to borrow
  - `onBehalf`: (Optional) Address to borrow on behalf of
  - `receiver`: Recipient address
- **Description**: Generates payload for taking a loan in a Morpho market

#### 3. Repay Loan
- **Endpoint**: `/api/tools/morpho/borrow/repay`
- **Method**: GET
- **Parameters**:
  - `marketParams`: Market parameters
  - `assets`: Amount of tokens to repay
  - `onBehalf`: (Optional) Address to repay on behalf of
- **Description**: Generates payload for repaying a loan in a Morpho market

#### 4. Withdraw Collateral
- **Endpoint**: `/api/tools/morpho/borrow/withdraw-collateral`
- **Method**: GET
- **Parameters**:
  - `marketParams`: Market parameters
  - `assets`: Amount of tokens to withdraw
  - `onBehalf`: (Optional) Address to withdraw on behalf of
  - `receiver`: Recipient address
- **Description**: Generates payload for withdrawing collateral from a Morpho market

#### 5. List Markets
- **Endpoint**: `/api/tools/morpho/borrow/get-markets`
- **Method**: GET
- **Parameters**:
  - `first`: (Optional) Number of results
  - `orderBy`: (Optional) Field to order by
  - `orderDirection`: (Optional) Order direction
- **Description**: Returns list of available markets

### Data Query

#### 1. Query APYs
- **Endpoint**: `/api/tools/morpho/data/get-apy`
- **Method**: GET
- **Parameters**:
  - `vaultAddress`: (Optional) Vault address
  - `marketParams`: (Optional) Market parameters
- **Description**: Returns APYs for vaults or markets

#### 2. Query User Positions
- **Endpoint**: `/api/tools/morpho/data/get-user-positions`
- **Method**: GET
- **Parameters**:
  - `userAddress`: User address
  - `type`: Position type (earn, borrow, or both)
- **Description**: Returns user positions in vaults and markets

#### 3. Query Vault Metrics
- **Endpoint**: `/api/tools/morpho/data/get-vault-metrics`
- **Method**: GET
- **Parameters**:
  - `vaultAddress`: Vault address
- **Description**: Returns detailed metrics for a specific vault

#### 4. Query Market Metrics
- **Endpoint**: `/api/tools/morpho/data/get-market-metrics`
- **Method**: GET
- **Parameters**:
  - `marketParams`: Market parameters
- **Description**: Returns detailed metrics for a specific market

## Utilities

### GraphQL
Functions for interacting with the Morpho GraphQL API (blue-api.morpho.org/graphql)

### Transaction
Functions for generating transaction payloads compatible with the format expected by agent-next-boilerplate

### Types
TypeScript type definitions for API parameters and responses
