import { GraphQLResponse } from './types';

/**
 * Utility for making GraphQL queries to the Morpho API
 * @param query GraphQL query string
 * @param variables Variables for the query
 * @returns GraphQL query response
 */
export async function fetchGraphQL<T>(query: string, variables?: Record<string, any>): Promise<GraphQLResponse<T>> {
  const endpoint = 'https://blue-api.morpho.org/graphql';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching GraphQL data:', error);
    throw error;
  }
}

/**
 * Query to get all vaults
 */
export const GET_ALL_VAULTS_QUERY = `
  query GetVaults($first: Int, $orderBy: String, $orderDirection: String) {
    vaults(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
      items {
        address
        symbol
        name
        whitelisted
        asset {
          id
          address
          decimals
        }
        chain {
          id
          network
        }
      }
    }
  }
`;

/**
 * Query to get metrics for a specific vault
 */
export const GET_VAULT_METRICS_QUERY = `
  query GetVaultMetrics($address: String!) {
    vaults(where: { address: $address }) {
      items {
        address
        symbol
        name
        state {
          totalAssets
          totalAssetsUsd
          totalSupply
          apy
          netApy
          netApyWithoutRewards
          dailyApy
        }
      }
    }
  }
`;

/**
 * Query to get all markets
 */
export const GET_ALL_MARKETS_QUERY = `
  query GetMarkets($first: Int, $orderBy: String, $orderDirection: String) {
    markets(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
      items {
        id
        loanToken {
          address
          symbol
          decimals
        }
        collateralToken {
          address
          symbol
          decimals
        }
        oracle
        irm
        lltv
      }
    }
  }
`;

/**
 * Query to get metrics for a specific market
 */
export const GET_MARKET_METRICS_QUERY = `
  query GetMarketMetrics($id: String!) {
    markets(where: { id: $id }) {
      items {
        id
        loanToken {
          address
          symbol
        }
        collateralToken {
          address
          symbol
        }
        state {
          totalBorrowed
          totalBorrowedUsd
          totalCollateral
          totalCollateralUsd
          borrowRate
          utilizationRate
        }
        lltv
      }
    }
  }
`;

/**
 * Query to get user positions
 */
export const GET_USER_POSITIONS_QUERY = `
  query GetUserPositions($userAddress: String!) {
    user(id: $userAddress) {
      vaultPositions {
        vault {
          address
          symbol
          asset {
            address
            symbol
          }
        }
        assets
        assetsUsd
        shares
      }
      borrowPositions {
        market {
          id
          loanToken {
            address
            symbol
          }
          collateralToken {
            address
            symbol
          }
        }
        borrowed
        borrowedUsd
        collateral
        collateralUsd
      }
    }
  }
`;
