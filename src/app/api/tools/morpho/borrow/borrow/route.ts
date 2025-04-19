import { NextResponse } from 'next/server';
import { encodeMarketParams, generateBorrowCalldata, generateTransactionPayload } from '../../utils/transaction';
import { ApiResponse, MarketParams, TransactionPayload } from '../../utils/types';

/**
 * API to generate transaction payload for borrowing from a Morpho market
 *
 * @param request HTTP request
 * @returns Response with transaction payload
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const morphoAddress = searchParams.get('morphoAddress');
    const loanToken = searchParams.get('loanToken');
    const collateralToken = searchParams.get('collateralToken');
    const oracle = searchParams.get('oracle');
    const irm = searchParams.get('irm');
    const lltv = searchParams.get('lltv');
    const assets = searchParams.get('assets');
    const receiver = searchParams.get('receiver');
    const onBehalf = searchParams.get('onBehalf') || undefined;

    // Required parameters validation
    if (!morphoAddress || !loanToken || !collateralToken || !oracle || !irm || !lltv || !assets || !receiver) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_PARAMETERS',
            message: 'The parameters morphoAddress, loanToken, collateralToken, oracle, irm, lltv, assets, and receiver are required'
          }
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Address format validation
    if (
      !/^0x[a-fA-F0-9]{40}$/.test(morphoAddress) ||
      !/^0x[a-fA-F0-9]{40}$/.test(loanToken) ||
      !/^0x[a-fA-F0-9]{40}$/.test(collateralToken) ||
      !/^0x[a-fA-F0-9]{40}$/.test(oracle) ||
      !/^0x[a-fA-F0-9]{40}$/.test(irm) ||
      !/^0x[a-fA-F0-9]{40}$/.test(receiver)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ADDRESS',
            message: 'Invalid address format'
          }
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // LLTV format validation
    const lltvNumber = parseInt(lltv);
    if (isNaN(lltvNumber) || lltvNumber <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_LLTV',
            message: 'The lltv parameter must be a positive number'
          }
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Assets format validation
    if (!/^\d*\.?\d+$/.test(assets)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ASSETS',
            message: 'Invalid assets value'
          }
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Create market parameters object
    const marketParams: MarketParams = {
      loanToken,
      collateralToken,
      oracle,
      irm,
      lltv: lltvNumber
    };

    // Encode market parameters
    const marketParamsEncoded = encodeMarketParams(marketParams);

    // Generate calldata for the borrow function
    const data = generateBorrowCalldata(marketParamsEncoded, assets, receiver, onBehalf);

    // Generate transaction payload
    const transactionPayload = generateTransactionPayload(morphoAddress, data);

    // Return transaction payload
    return NextResponse.json(
      {
        success: true,
        data: {
          transactionPayload,
          description: `Borrowing ${assets} tokens from the ${loanToken}/${collateralToken} market`
        }
      } as ApiResponse<{
        transactionPayload: TransactionPayload,
        description: string
      }>,
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating transaction payload for borrowing:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to generate transaction payload for borrowing'
        }
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
