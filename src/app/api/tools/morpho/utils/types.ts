// Types for Morpho Labs integration

// Base API response type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// Types for Vaults (Earn)
export interface VaultParams {
  address: string;
  symbol?: string;
  name?: string;
  asset?: {
    address: string;
    decimals: number;
  };
}

// Types for Markets (Borrow)
export interface MarketParams {
  loanToken: string;      // Token that can be borrowed and supplied
  collateralToken: string; // Token that can be used as collateral
  oracle: string;         // Oracle that can be used to price the loan and collateral
  irm: string;            // Interest rate model
  lltv: number;           // Liquidation loan-to-value ratio
}

// Transaction payload type
export interface TransactionPayload {
  to: string;
  value: string;
  data: string;
}

// User position types
export interface UserPosition {
  type: 'earn' | 'borrow';
  address: string;
  assets: string;
  assetsUsd: string;
  shares: string;
}

// Market metrics type
export interface MarketMetrics {
  loanToken: string;
  collateralToken: string;
  totalBorrowed: string;
  totalBorrowedUsd: string;
  totalCollateral: string;
  totalCollateralUsd: string;
  borrowRate: string;
  utilizationRate: string;
  lltv: string;
}

// Vault metrics type
export interface VaultMetrics {
  address: string;
  symbol: string;
  name: string;
  totalAssets: string;
  totalAssetsUsd: string;
  totalSupply: string;
  apy: string;
  netApy: string;
  netApyWithoutRewards: string;
  dailyApy: string;
}

// Types for GraphQL queries
export interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations: Array<{
      line: number;
      column: number;
    }>;
    path: string[];
  }>;
}

// Types for rewards
export interface RewardClaim {
  account: string;
  claimable: string;
  proof: string[];
}
