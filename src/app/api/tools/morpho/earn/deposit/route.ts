import { NextResponse } from 'next/server';
import { generateDepositCalldata, generateTransactionPayload } from '../../utils/transaction';
import { ApiResponse, TransactionPayload } from '../../utils/types';
import { validateAddress, validateAmount } from '../../utils/validation';
import { ERRORS, createErrorResponse, MorphoError } from '../../utils/errors';
import { logRequest, logError } from '../../utils/logger';
import { rateLimit } from '../../middleware/rateLimit';

/**
 * API to generate transaction payload for depositing tokens in a Morpho vault
 *
 * @param request HTTP request
 * @returns Response with transaction payload
 */
export async function GET(request: Request) {
  try {
    // Apply rate limiting
    const rateLimitResponse = rateLimit(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const { searchParams } = new URL(request.url);
    const vaultAddress = searchParams.get('vaultAddress');
    const amount = searchParams.get('amount');
    const receiver = searchParams.get('receiver') || undefined;

    // Log the request
    logRequest('GET', '/api/tools/morpho/earn/deposit', { vaultAddress, amount, receiver });

    // Required parameters validation
    if (!vaultAddress || !amount) {
      return NextResponse.json(
        {
          success: false,
          error: 'The parameters vaultAddress and amount are required'
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Address format validation
    if (!/^0x[a-fA-F0-9]{40}$/.test(vaultAddress)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid vault address format'
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Amount format validation
    if (!/^\d*\.?\d+$/.test(amount)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid amount value'
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Generate calldata for the deposit function
    const data = generateDepositCalldata(amount, receiver);

    // Generate transaction payload
    const transactionPayload = generateTransactionPayload(vaultAddress, data);

    // Return transaction payload
    return NextResponse.json(
      {
        success: true,
        data: {
          transactionPayload,
          description: `Depositing ${amount} tokens in vault ${vaultAddress}`
        }
      } as ApiResponse<{
        transactionPayload: TransactionPayload,
        description: string
      }>,
      { status: 200 }
    );
  } catch (error) {
    // Log the error
    logError(error as Error, { endpoint: '/api/tools/morpho/earn/deposit' });

    // Determine appropriate status code
    const status = error instanceof MorphoError ? error.status : 500;

    // Return error response
    return NextResponse.json(
      createErrorResponse(error as Error),
      { status }
    );
  }
}
