import { NextResponse } from 'next/server';
import { fetchGraphQL, GET_ALL_VAULTS_QUERY } from '../../utils/graphql';
import { ApiResponse } from '../../utils/types';

/**
 * API to list available vaults in Morpho
 *
 * @param request HTTP request
 * @returns Response with list of vaults
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const first = searchParams.get('first') ? parseInt(searchParams.get('first')!) : 100;
    const orderBy = searchParams.get('orderBy') || 'totalAssetsUsd';
    const orderDirection = searchParams.get('orderDirection') || 'desc';

    // Parameter validation
    if (isNaN(first) || first <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_PARAMETER',
            message: 'The first parameter must be a positive number'
          }
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Query vaults via GraphQL
    const response = await fetchGraphQL<{
      vaults: {
        items: Array<{
          address: string;
          symbol: string;
          name: string;
          whitelisted: boolean;
          asset: {
            id: string;
            address: string;
            decimals: number;
          };
          chain: {
            id: string;
            network: string;
          };
        }>;
      };
    }>(GET_ALL_VAULTS_QUERY, {
      first,
      orderBy,
      orderDirection
    });

    // Check for GraphQL response errors
    if (response.errors) {
      console.error('GraphQL query errors:', response.errors);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'GRAPHQL_ERROR',
            message: 'Error querying vaults: ' + response.errors[0].message
          }
        } as ApiResponse<null>,
        { status: 500 }
      );
    }

    // Format response
    const vaults = response.data.vaults.items.map(vault => ({
      address: vault.address,
      symbol: vault.symbol,
      name: vault.name,
      whitelisted: vault.whitelisted,
      asset: {
        address: vault.asset.address,
        decimals: vault.asset.decimals
      },
      chain: vault.chain.network
    }));

    // Return list of vaults
    return NextResponse.json(
      {
        success: true,
        data: {
          vaults,
          count: vaults.length
        }
      } as ApiResponse<{
        vaults: Array<{
          address: string;
          symbol: string;
          name: string;
          whitelisted: boolean;
          asset: {
            address: string;
            decimals: number;
          };
          chain: string;
        }>;
        count: number;
      }>,
      { status: 200 }
    );
  } catch (error) {
    console.error('Error listing vaults:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to list vaults'
        }
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
