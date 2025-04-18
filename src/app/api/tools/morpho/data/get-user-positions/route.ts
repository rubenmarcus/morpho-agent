import { NextResponse } from 'next/server';
import { fetchGraphQL, GET_USER_POSITIONS_QUERY } from '../../utils/graphql';
import { ApiResponse, UserPosition } from '../../utils/types';

/**
 * API to get user positions in Morpho vaults and markets
 *
 * @param request HTTP request
 * @returns Response with user positions
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get('userAddress');
    const type = searchParams.get('type') || 'all'; // 'earn', 'borrow', or 'all'

    // Required parameter validation
    if (!userAddress) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_PARAMETER',
            message: 'The userAddress parameter is required'
          }
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Address format validation
    if (!/^0x[a-fA-F0-9]{40}$/.test(userAddress)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ADDRESS',
            message: 'Invalid user address format'
          }
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Type parameter validation
    if (!['earn', 'borrow', 'all'].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_PARAMETER',
            message: 'The type parameter must be "earn", "borrow", or "all"'
          }
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Consultar posições do usuário via GraphQL
    const response = await fetchGraphQL<{
      user: {
        vaultPositions: Array<{
          vault: {
            address: string;
            symbol: string;
            asset: {
              address: string;
              symbol: string;
            };
          };
          assets: string;
          assetsUsd: string;
          shares: string;
        }>;
        borrowPositions: Array<{
          market: {
            id: string;
            loanToken: {
              address: string;
              symbol: string;
            };
            collateralToken: {
              address: string;
              symbol: string;
            };
          };
          borrowed: string;
          borrowedUsd: string;
          collateral: string;
          collateralUsd: string;
        }>;
      };
    }>(GET_USER_POSITIONS_QUERY, {
      userAddress
    });

    // Check for GraphQL response errors
    if (response.errors) {
      console.error('GraphQL query errors:', response.errors);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'GRAPHQL_ERROR',
            message: 'Error querying user positions: ' + response.errors[0].message
          }
        } as ApiResponse<null>,
        { status: 500 }
      );
    }

    // Verificar se o usuário foi encontrado
    if (!response.data.user) {
      return NextResponse.json(
        {
          success: true,
          data: {
            earnPositions: [],
            borrowPositions: [],
            totalPositions: 0
          }
        },
        { status: 200 }
      );
    }

    // Formatar posições de earn (vaults)
    const earnPositions = type === 'all' || type === 'earn'
      ? response.data.user.vaultPositions.map(position => ({
          type: 'earn' as const,
          address: position.vault.address,
          symbol: position.vault.symbol,
          assetSymbol: position.vault.asset.symbol,
          assets: position.assets,
          assetsUsd: position.assetsUsd,
          shares: position.shares
        }))
      : [];

    // Formatar posições de borrow (mercados)
    const borrowPositions = type === 'all' || type === 'borrow'
      ? response.data.user.borrowPositions.map(position => ({
          type: 'borrow' as const,
          marketId: position.market.id,
          loanToken: {
            address: position.market.loanToken.address,
            symbol: position.market.loanToken.symbol
          },
          collateralToken: {
            address: position.market.collateralToken.address,
            symbol: position.market.collateralToken.symbol
          },
          borrowed: position.borrowed,
          borrowedUsd: position.borrowedUsd,
          collateral: position.collateral,
          collateralUsd: position.collateralUsd
        }))
      : [];

    // Retornar posições do usuário
    return NextResponse.json(
      {
        success: true,
        data: {
          earnPositions,
          borrowPositions,
          totalPositions: earnPositions.length + borrowPositions.length
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting user positions:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get user positions'
        }
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
