import { NextResponse } from 'next/server';
import { fetchGraphQL, GET_MARKET_METRICS_QUERY } from '../../utils/graphql';
import { ApiResponse, MarketMetrics } from '../../utils/types';

/**
 * API to get detailed metrics for a specific market
 *
 * @param request HTTP request
 * @returns Response with market metrics
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const marketId = searchParams.get('marketId');

    // Required parameter validation
    if (!marketId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_PARAMETER',
            message: 'The marketId parameter is required'
          }
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Query market metrics via GraphQL
    const response = await fetchGraphQL<{
      markets: {
        items: Array<{
          id: string;
          loanToken: {
            address: string;
            symbol: string;
          };
          collateralToken: {
            address: string;
            symbol: string;
          };
          state: {
            totalBorrowed: string;
            totalBorrowedUsd: string;
            totalCollateral: string;
            totalCollateralUsd: string;
            borrowRate: string;
            utilizationRate: string;
          };
          lltv: string;
        }>;
      };
    }>(GET_MARKET_METRICS_QUERY, {
      id: marketId
    });

    // Check for GraphQL response errors
    if (response.errors) {
      console.error('GraphQL query errors:', response.errors);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'GRAPHQL_ERROR',
            message: 'Error querying market metrics: ' + response.errors[0].message
          }
        } as ApiResponse<null>,
        { status: 500 }
      );
    }

    // Check if market exists
    if (response.data.markets.items.length === 0) {
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
    const market = response.data.markets.items[0];

    // Format metrics
    const metrics: MarketMetrics = {
      loanToken: market.loanToken.address,
      collateralToken: market.collateralToken.address,
      totalBorrowed: market.state.totalBorrowed,
      totalBorrowedUsd: market.state.totalBorrowedUsd,
      totalCollateral: market.state.totalCollateral,
      totalCollateralUsd: market.state.totalCollateralUsd,
      borrowRate: market.state.borrowRate,
      utilizationRate: market.state.utilizationRate,
      lltv: market.lltv
    };

    // Return market metrics
    return NextResponse.json(
      {
        success: true,
        data: metrics
      } as ApiResponse<MarketMetrics>,
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting market metrics:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get market metrics'
        }
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
