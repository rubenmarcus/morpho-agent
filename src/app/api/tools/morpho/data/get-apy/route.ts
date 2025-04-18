import { NextResponse } from 'next/server';
import { fetchGraphQL } from '../../utils/graphql';
import { ApiResponse } from '../../utils/types';

/**
 * API to get APYs from Morpho vaults and markets
 *
 * @param request HTTP request
 * @returns Response with APYs
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vaultAddress = searchParams.get('vaultAddress');
    const marketId = searchParams.get('marketId');

    // If no parameters are provided, return APYs for all vaults
    if (!vaultAddress && !marketId) {
      // Query to get APYs for all vaults
      const vaultsQuery = `
        query GetVaultsAPY {
          vaults {
            items {
              address
              symbol
              name
              asset {
                symbol
              }
              state {
                apy
                netApy
                netApyWithoutRewards
                dailyApy
              }
            }
          }
        }
      `;

      const vaultsResponse = await fetchGraphQL<{
        vaults: {
          items: Array<{
            address: string;
            symbol: string;
            name: string;
            asset: {
              symbol: string;
            };
            state: {
              apy: string;
              netApy: string;
              netApyWithoutRewards: string;
              dailyApy: string;
            };
          }>;
        };
      }>(vaultsQuery);

      // Check for GraphQL response errors
      if (vaultsResponse.errors) {
        console.error('GraphQL query errors:', vaultsResponse.errors);
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'GRAPHQL_ERROR',
              message: 'Error querying vault APYs: ' + vaultsResponse.errors[0].message
            }
          } as ApiResponse<null>,
          { status: 500 }
        );
      }

      // Format response
      const vaultsApy = vaultsResponse.data.vaults.items.map(vault => ({
        address: vault.address,
        symbol: vault.symbol,
        name: vault.name,
        assetSymbol: vault.asset.symbol,
        apy: vault.state.apy,
        netApy: vault.state.netApy,
        netApyWithoutRewards: vault.state.netApyWithoutRewards,
        dailyApy: vault.state.dailyApy
      }));

      // Return APYs for all vaults
      return NextResponse.json(
        {
          success: true,
          data: {
            vaults: vaultsApy
          }
        } as ApiResponse<{
          vaults: Array<{
            address: string;
            symbol: string;
            name: string;
            assetSymbol: string;
            apy: string;
            netApy: string;
            netApyWithoutRewards: string;
            dailyApy: string;
          }>;
        }>,
        { status: 200 }
      );
    }

    // If vaultAddress is provided, return APY for specific vault
    if (vaultAddress) {
      // Address format validation
      if (!/^0x[a-fA-F0-9]{40}$/.test(vaultAddress)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_ADDRESS',
              message: 'Invalid vault address format'
            }
          } as ApiResponse<null>,
          { status: 400 }
        );
      }

      // Query to get APY for specific vault
      const vaultQuery = `
        query GetVaultAPY($address: String!) {
          vaults(where: { address: $address }) {
            items {
              address
              symbol
              name
              asset {
                symbol
              }
              state {
                apy
                netApy
                netApyWithoutRewards
                dailyApy
              }
            }
          }
        }
      `;

      const vaultResponse = await fetchGraphQL<{
        vaults: {
          items: Array<{
            address: string;
            symbol: string;
            name: string;
            asset: {
              symbol: string;
            };
            state: {
              apy: string;
              netApy: string;
              netApyWithoutRewards: string;
              dailyApy: string;
            };
          }>;
        };
      }>(vaultQuery, {
        address: vaultAddress
      });

      // Check for GraphQL response errors
      if (vaultResponse.errors) {
        console.error('GraphQL query errors:', vaultResponse.errors);
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'GRAPHQL_ERROR',
              message: 'Error querying vault supply rate: ' + vaultResponse.errors[0].message
            }
          } as ApiResponse<null>,
          { status: 500 }
        );
      }

      // Check if the vault was found
      if (vaultResponse.data.vaults.items.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VAULT_NOT_FOUND',
              message: 'Vault not found'
            }
          } as ApiResponse<null>,
          { status: 404 }
        );
      }

      // Extract vault data
      const vault = vaultResponse.data.vaults.items[0];

      // Format response
      const vaultApy = {
        address: vault.address,
        symbol: vault.symbol,
        name: vault.name,
        assetSymbol: vault.asset.symbol,
        apy: vault.state.apy,
        netApy: vault.state.netApy,
        netApyWithoutRewards: vault.state.netApyWithoutRewards,
        dailyApy: vault.state.dailyApy
      };

      // Return specific vault APY
      return NextResponse.json(
        {
          success: true,
          data: vaultApy
        } as ApiResponse<{
          address: string;
          symbol: string;
          name: string;
          assetSymbol: string;
          apy: string;
          netApy: string;
          netApyWithoutRewards: string;
          dailyApy: string;
        }>,
        { status: 200 }
      );
    }

    // If marketId is provided, return borrow rate for specific market
    if (marketId) {
      // Query to get borrow rate for specific market
      const marketQuery = `
        query GetMarketBorrowRate($id: String!) {
          markets(where: { id: $id }) {
            items {
              id
              loanToken {
                symbol
              }
              collateralToken {
                symbol
              }
              state {
                borrowRate
                utilizationRate
              }
            }
          }
        }
      `;

      const marketResponse = await fetchGraphQL<{
        markets: {
          items: Array<{
            id: string;
            loanToken: {
              symbol: string;
            };
            collateralToken: {
              symbol: string;
            };
            state: {
              borrowRate: string;
              utilizationRate: string;
            };
          }>;
        };
      }>(marketQuery, {
        id: marketId
      });

      // Check for GraphQL response errors
      if (marketResponse.errors) {
        console.error('GraphQL query errors:', marketResponse.errors);
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'GRAPHQL_ERROR',
              message: 'Error querying market borrow rate: ' + marketResponse.errors[0].message
            }
          } as ApiResponse<null>,
          { status: 500 }
        );
      }

      // Check if the market was found
      if (marketResponse.data.markets.items.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'MARKET_NOT_FOUND',
              message: 'Market not found'
            }
          } as ApiResponse<null>,
          { status: 404 }
        );
      }

      // Extract market data
      const market = marketResponse.data.markets.items[0];

      // Format response
      const marketRate = {
        id: market.id,
        loanTokenSymbol: market.loanToken.symbol,
        collateralTokenSymbol: market.collateralToken.symbol,
        borrowRate: market.state.borrowRate,
        utilizationRate: market.state.utilizationRate
      };

      // Return specific market borrow rate
      return NextResponse.json(
        {
          success: true,
          data: marketRate
        } as ApiResponse<{
          id: string;
          loanTokenSymbol: string;
          collateralTokenSymbol: string;
          borrowRate: string;
          utilizationRate: string;
        }>,
        { status: 200 }
      );
    }

    // This point should not be reached due to previous checks
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INVALID_PARAMETERS',
          message: 'Invalid parameters'
        }
      } as ApiResponse<null>,
      { status: 400 }
    );
  } catch (error) {
    console.error('Error getting APYs:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get APYs'
        }
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
