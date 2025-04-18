/**
 * Validates if a string is a valid Ethereum address
 * @param address - The address to validate
 * @returns boolean indicating if the address is valid
 */
export function validateAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validates if a string is a valid amount (positive number)
 * @param amount - The amount to validate
 * @returns boolean indicating if the amount is valid
 */
export function validateAmount(amount: string): boolean {
  return /^\d*\.?\d+$/.test(amount);
}

/**
 * Validates if a string is a valid LLTV (Liquidation Loan-to-Value) ratio
 * @param lltv - The LLTV value to validate
 * @returns object containing validation result and parsed value
 */
export function validateLltv(lltv: string): { isValid: boolean; value?: number } {
  const value = parseInt(lltv);
  return {
    isValid: !isNaN(value) && value > 0,
    value: value
  };
}

/**
 * Validates market parameters
 * @param params - The market parameters to validate
 * @returns boolean indicating if all parameters are valid
 */
export function validateMarketParams(params: {
  morphoAddress: string;
  loanToken: string;
  collateralToken: string;
  oracle: string;
  irm: string;
}): boolean {
  return (
    validateAddress(params.morphoAddress) &&
    validateAddress(params.loanToken) &&
    validateAddress(params.collateralToken) &&
    validateAddress(params.oracle) &&
    validateAddress(params.irm)
  );
}