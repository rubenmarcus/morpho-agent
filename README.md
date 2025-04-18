# Morpho Labs API Agent

This project provides an API for interacting with the Morpho Labs protocol on Ethereum, enabling deposit, withdrawal, loan, and data query operations through an AI agent on the Bitte platform.

## Features

- 🏦 **Morpho Vaults (Earn)**:
  - Token deposits and withdrawals
  - Available vaults query
  - Rewards claiming
  - Detailed vault metrics

- 💰 **Morpho Markets (Borrow)**:
  - Collateral supply
  - Loan taking
  - Loan repayment
  - Collateral withdrawal
  - Available markets query

- 📊 **Data Query**:
  - Vault and market APYs
  - User positions
  - Detailed metrics

- ⚡ Next.js 15 with App Router
- 🔗 Viem integration for Ethereum interactions
- 📝 TypeScript support
- 🔄 Development environment with hot reload

## Quick Start

1. Clone this repository
2. Configure environment variables (create a `.env` or `.env.local` file)

```bash
# Get your API key at https://key.bitte.ai
BITTE_API_KEY='your-api-key'

ACCOUNT_ID='your-account.near'
```

3. Install dependencies:

```bash
pnpm install
```

4. Start the development server:

```bash
pnpm run dev
```

This will:
- Start your Next.js application
- Launch make-agent
- Request you to sign a message in the Bitte wallet to create an API key
- Launch your agent in the Bitte playground
- Allow you to freely edit and develop your code in the playground environment

5. Build the project locally:

```bash
pnpm run build:dev
```

## Available APIs

### Morpho Vaults (Earn)

#### 1. Vault Deposit
- Endpoint: `/api/tools/morpho/earn/deposit`
- Method: GET
- Parameters:
  - `vaultAddress`: Morpho vault address
  - `amount`: Amount of tokens to deposit
  - `receiver` (optional): Recipient address

#### 2. Vault Withdrawal
- Endpoint: `/api/tools/morpho/earn/withdraw`
- Method: GET
- Parameters:
  - `vaultAddress`: Morpho vault address
  - `amount` or `shares`: Amount of tokens or shares to withdraw
  - `receiver` (optional): Recipient address
  - `owner` (optional): Owner address

#### 3. Claim Rewards
- Endpoint: `/api/tools/morpho/earn/claim-rewards`
- Method: GET
- Parameters:
  - `urdAddress`: Universal Rewards Distributor address
  - `account`: Account address
  - `claimable`: Claimable amount
  - `proof`: Merkle proof

#### 4. List Available Vaults
- Endpoint: `/api/tools/morpho/earn/get-vaults`
- Method: GET
- Parameters:
  - `first` (optional): Number of results
  - `orderBy` (optional): Field to order by
  - `orderDirection` (optional): Order direction (asc/desc)

### Morpho Markets (Borrow)

#### 1. Supply Collateral
- Endpoint: `/api/tools/morpho/borrow/supply-collateral`
- Method: GET
- Parameters:
  - `morphoAddress`: Morpho contract address
  - `loanToken`: Loan token address
  - `collateralToken`: Collateral token address
  - `oracle`: Oracle address
  - `irm`: Interest rate model address
  - `lltv`: Liquidation loan-to-value ratio
  - `assets`: Amount of tokens to supply
  - `onBehalf` (optional): Address to supply on behalf of

#### 2. Take Loan
- Endpoint: `/api/tools/morpho/borrow/borrow`
- Method: GET
- Parameters:
  - `morphoAddress`: Morpho contract address
  - `loanToken`: Loan token address
  - `collateralToken`: Collateral token address
  - `oracle`: Oracle address
  - `irm`: Interest rate model address
  - `lltv`: Liquidation loan-to-value ratio
  - `assets`: Amount of tokens to borrow
  - `receiver`: Recipient address
  - `onBehalf` (optional): Address to borrow on behalf of

#### 3. Repay Loan
- Endpoint: `/api/tools/morpho/borrow/repay`
- Method: GET
- Parameters:
  - `morphoAddress`: Morpho contract address
  - `loanToken`: Loan token address
  - `collateralToken`: Collateral token address
  - `oracle`: Oracle address
  - `irm`: Interest rate model address
  - `lltv`: Liquidation loan-to-value ratio
  - `assets`: Amount of tokens to repay
  - `onBehalf` (optional): Address to repay on behalf of

#### 4. Withdraw Collateral
- Endpoint: `/api/tools/morpho/borrow/withdraw-collateral`
- Method: GET
- Parameters:
  - `morphoAddress`: Morpho contract address
  - `loanToken`: Loan token address
  - `collateralToken`: Collateral token address
  - `oracle`: Oracle address
  - `irm`: Interest rate model address
  - `lltv`: Liquidation loan-to-value ratio
  - `assets`: Amount of tokens to withdraw
  - `receiver`: Recipient address
  - `onBehalf` (optional): Address to withdraw on behalf of

#### 5. List Available Markets
- Endpoint: `/api/tools/morpho/borrow/get-markets`
- Method: GET
- Parameters:
  - `first` (optional): Number of results
  - `orderBy` (optional): Field to order by
  - `orderDirection` (optional): Order direction (asc/desc)

### Data Query

#### 1. Query APYs
- Endpoint: `/api/tools/morpho/data/get-apy`
- Method: GET
- Parameters:
  - `vaultAddress` (optional): Vault address
  - `marketId` (optional): Market ID

#### 2. Query User Positions
- Endpoint: `/api/tools/morpho/data/get-user-positions`
- Method: GET
- Parameters:
  - `userAddress`: User address
  - `type` (optional): Position type (earn, borrow, or all)

#### 3. Query Vault Metrics
- Endpoint: `/api/tools/morpho/data/get-vault-metrics`
- Method: GET
- Parameters:
  - `vaultAddress`: Vault address

#### 4. Query Market Metrics
- Endpoint: `/api/tools/morpho/data/get-market-metrics`
- Method: GET
- Parameters:
  - `marketId`: Market ID

## AI Agent Configuration

The template includes a pre-configured AI agent in the `/api/ai-plugin/route.ts` file. You can customize the agent's behavior by modifying the configuration in this file.

## Deployment

1. Push your code to GitHub
2. Deploy to Vercel or your preferred hosting platform
3. Add your `BITTE_API_KEY` to the environment variables
4. The `make-agent deploy` command will run automatically during the build process

## Additional Resources

- [Morpho Labs Documentation](https://docs.morpho.org)
- [Bitte Protocol Documentation](https://docs.bitte.ai)
- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAPI Specification](https://swagger.io/specification/)

## Contributing

Contributions are welcome! Feel free to submit a Pull Request.

## License

MIT License
