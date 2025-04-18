/**
 * Custom error class for Morpho API errors
 */
export class MorphoError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number = 400
  ) {
    super(message);
    this.name = 'MorphoError';
  }
}

/**
 * Standard error codes and messages for the Morpho API
 */
export const ERRORS = {
  INVALID_ADDRESS: new MorphoError('INVALID_ADDRESS', 'Invalid address format'),
  INVALID_AMOUNT: new MorphoError('INVALID_AMOUNT', 'Invalid amount format'),
  INVALID_LLTV: new MorphoError('INVALID_LLTV', 'Invalid LLTV value'),
  MISSING_PARAMETER: new MorphoError('MISSING_PARAMETER', 'Required parameter is missing'),
  INVALID_MARKET_PARAMS: new MorphoError('INVALID_MARKET_PARAMS', 'Invalid market parameters'),
  TRANSACTION_FAILED: new MorphoError('TRANSACTION_FAILED', 'Transaction failed', 500),
  INTERNAL_ERROR: new MorphoError('INTERNAL_ERROR', 'Internal server error', 500),
  RATE_LIMIT_EXCEEDED: new MorphoError('RATE_LIMIT_EXCEEDED', 'Too many requests', 429),
};

/**
 * Creates a standardized error response
 * @param error - The error object
 * @returns Formatted error response
 */
export function createErrorResponse(error: MorphoError | Error) {
  if (error instanceof MorphoError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        status: error.status
      }
    };
  }

  return {
    success: false,
    error: {
      code: 'UNKNOWN_ERROR',
      message: error.message,
      status: 500
    }
  };
}