import { NextResponse } from 'next/server';
import { fetchGraphQL, GET_VAULT_METRICS_QUERY } from '../../utils/graphql';
import { ApiResponse, VaultMetrics } from '../../utils/types';

/**
 * API to get detailed metrics for a specific vault
 *
 * @param request HTTP request
 * @returns Response with vault metrics
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vaultAddress = searchParams.get('vaultAddress');

    // Parameter validation
    if (!vaultAddress) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_PARAMETER',
            message: 'The vaultAddress parameter is required'
          }
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Address format validation
    if (!/^0x[a-fA-F0-9]{40}$/.test(vaultAddress)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ADDRESS',
            message: 'Invalid vault address'
          }
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Query vault metrics via GraphQL
    const response = await fetchGraphQL<{
      vaults: {
        items: Array<{
          address: string;
          symbol: string;
          name: string;
          state: {
            totalAssets: string;
            totalAssetsUsd: string;
            totalSupply: string;
            apy: string;
            netApy: string;
            netApyWithoutRewards: string;
            dailyApy: string;
          };
        }>;
      };
    }>(GET_VAULT_METRICS_QUERY, {
      address: vaultAddress
    });

    // Check for GraphQL response errors
    if (response.errors) {
      console.error('GraphQL query errors:', response.errors);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'GRAPHQL_ERROR',
            message: 'Error querying vault metrics: ' + response.errors[0].message
          }
        } as ApiResponse<null>,
        { status: 500 }
      );
    }

    // Check if vault was found
    if (response.data.vaults.items.length === 0) {
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
    const vault = response.data.vaults.items[0];

    // Format metrics
    const metrics: VaultMetrics = {
      address: vault.address,
      symbol: vault.symbol,
      name: vault.name,
      totalAssets: vault.state.totalAssets,
      totalAssetsUsd: vault.state.totalAssetsUsd,
      totalSupply: vault.state.totalSupply,
      apy: vault.state.apy,
      netApy: vault.state.netApy,
      netApyWithoutRewards: vault.state.netApyWithoutRewards,
      dailyApy: vault.state.dailyApy
    };

    // Return vault metrics
    return NextResponse.json(
      {
        success: true,
        data: metrics
      } as ApiResponse<VaultMetrics>,
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting vault metrics:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get vault metrics'
        }
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
