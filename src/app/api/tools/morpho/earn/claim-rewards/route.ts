import { NextResponse } from 'next/server';
import { generateClaimRewardsCalldata, generateTransactionPayload } from '../../utils/transaction';
import { ApiResponse, TransactionPayload } from '../../utils/types';

/**
 * API to generate transaction payload for claiming rewards from Morpho vaults
 *
 * @param request HTTP request
 * @returns Response with transaction payload
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const urdAddress = searchParams.get('urdAddress');
    const account = searchParams.get('account');
    const claimable = searchParams.get('claimable');
    const proof = searchParams.get('proof');

    // Required parameters validation
    if (!urdAddress || !account || !claimable || !proof) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_PARAMETERS',
            message: 'The parameters urdAddress, account, claimable, and proof are required'
          }
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Address format validation
    if (
      !/^0x[a-fA-F0-9]{40}$/.test(urdAddress) ||
      !/^0x[a-fA-F0-9]{40}$/.test(account)
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

    // Claimable amount validation
    if (!/^\d*\.?\d+$/.test(claimable)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_CLAIMABLE',
            message: 'Invalid claimable amount'
          }
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Proof format validation
    let proofArray: string[];
    try {
      proofArray = JSON.parse(proof);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_PROOF',
            message: 'Invalid proof format'
          }
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Generate calldata for the claim function
    const data = generateClaimRewardsCalldata(account, claimable, proofArray);

    // Generate transaction payload
    const transactionPayload = generateTransactionPayload(urdAddress, data);

    // Return transaction payload
    return NextResponse.json(
      {
        success: true,
        data: {
          transactionPayload,
          description: `Claiming ${claimable} rewards for account ${account}`
        }
      } as ApiResponse<{
        transactionPayload: TransactionPayload,
        description: string
      }>,
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating transaction payload for rewards claim:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to generate transaction payload for rewards claim'
        }
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
