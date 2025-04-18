import { NextResponse } from 'next/server';
import { generateWithdrawCalldata, generateTransactionPayload } from '../../utils/transaction';
import { ApiResponse, TransactionPayload } from '../../utils/types';

/**
 * API to generate transaction payload for withdrawing tokens from a Morpho vault
 *
 * @param request HTTP request
 * @returns Response with transaction payload
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vaultAddress = searchParams.get('vaultAddress');
    const amount = searchParams.get('amount');
    const shares = searchParams.get('shares');
    const receiver = searchParams.get('receiver') || undefined;
    const owner = searchParams.get('owner') || undefined;

    // Required parameters validation
    if (!vaultAddress || (!amount && !shares)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_PARAMETERS',
            message: 'The parameters vaultAddress and either amount or shares are required'
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
            message: 'Invalid vault address format'
          }
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Amount or shares format validation
    if (amount && !/^\d*\.?\d+$/.test(amount)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_AMOUNT',
            message: 'Invalid amount value'
          }
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    if (shares && !/^\d*\.?\d+$/.test(shares)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_SHARES',
            message: 'Invalid shares value'
          }
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Generate calldata for the withdraw function
    const withdrawAmount = amount || shares;
    if (!withdrawAmount) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_PARAMETERS',
            message: 'Either amount or shares must be provided'
          }
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const data = generateWithdrawCalldata(withdrawAmount, receiver, owner);

    // Generate transaction payload
    const transactionPayload = generateTransactionPayload(vaultAddress, data);

    // Return transaction payload
    return NextResponse.json(
      {
        success: true,
        data: {
          transactionPayload,
          description: `Withdrawing ${withdrawAmount} ${amount ? 'tokens' : 'shares'} from vault ${vaultAddress}`
        }
      } as ApiResponse<{
        transactionPayload: TransactionPayload,
        description: string
      }>,
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating transaction payload for withdrawal:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to generate transaction payload for withdrawal'
        }
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
