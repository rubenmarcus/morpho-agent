import { NextResponse } from 'next/server';
import { fetchGraphQL, GET_ALL_MARKETS_QUERY } from '../../utils/graphql';
import { ApiResponse } from '../../utils/types';

/**
 * API to list available markets in Morpho
 *
 * @param request HTTP request
 * @returns Response with list of markets
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const first = searchParams.get('first') ? parseInt(searchParams.get('first')!) : 100;
    const orderBy = searchParams.get('orderBy') || 'totalBorrowedUsd';
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

    // Query markets via GraphQL
    const response = await fetchGraphQL<{
      markets: {
        items: Array<{
          id: string;
          loanToken: {
            address: string;
            symbol: string;
            decimals: number;
          };
          collateralToken: {
            address: string;
            symbol: string;
            decimals: number;
          };
          oracle: string;
          irm: string;
          lltv: string;
        }>;
      };
    }>(GET_ALL_MARKETS_QUERY, {
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
            message: 'Error querying markets: ' + response.errors[0].message
          }
        } as ApiResponse<null>,
        { status: 500 }
      );
    }

    // Format response
    const markets = response.data.markets.items.map(market => ({
      id: market.id,
      loanToken: {
        address: market.loanToken.address,
        symbol: market.loanToken.symbol,
        decimals: market.loanToken.decimals
      },
      collateralToken: {
        address: market.collateralToken.address,
        symbol: market.collateralToken.symbol,
        decimals: market.collateralToken.decimals
      },
      oracle: market.oracle,
      irm: market.irm,
      lltv: market.lltv
    }));

    // Return list of markets
    return NextResponse.json(
      {
        success: true,
        data: {
          markets,
          count: markets.length
        }
      } as ApiResponse<{
        markets: Array<{
          id: string;
          loanToken: {
            address: string;
            symbol: string;
            decimals: number;
          };
          collateralToken: {
            address: string;
            symbol: string;
            decimals: number;
          };
          oracle: string;
          irm: string;
          lltv: string;
        }>;
        count: number;
      }>,
      { status: 200 }
    );
  } catch (error) {
    console.error('Error listing markets:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to list markets'
        }
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
