import { parseEther, encodeAbiParameters, encodeFunctionData } from 'viem';
import { TransactionPayload, MarketParams } from './types';

/**
 * Utility to generate transaction payloads compatible with the agent-next-boilerplate format
 * @param to Target contract address
 * @param value ETH value to send (optional)
 * @param data Transaction data (calldata)
 * @returns Transaction payload
 */
export function generateTransactionPayload(to: string, value: string = '0', data: string = '0x'): TransactionPayload {
  return {
    to,
    value,
    data
  };
}

/**
 * Encodes market parameters into a bytes32 value
 * @param params Market parameters to encode
 * @returns Encoded market parameters as bytes32
 */
export function encodeMarketParams(params: MarketParams): string {
  return encodeAbiParameters(
    [
      { type: 'address', name: 'loanToken' },
      { type: 'address', name: 'collateralToken' },
      { type: 'address', name: 'oracle' },
      { type: 'address', name: 'irm' },
      { type: 'uint256', name: 'lltv' }
    ],
    [
      params.loanToken as `0x${string}`,
      params.collateralToken as `0x${string}`,
      params.oracle as `0x${string}`,
      params.irm as `0x${string}`,
      BigInt(params.lltv)
    ]
  );
}

/**
 * Generates calldata for vault deposit
 * @param vaultAddress Vault contract address
 * @param amount Amount of tokens to deposit
 * @param receiver Recipient address (optional)
 * @returns Encoded calldata
 */
export function generateDepositCalldata(vaultAddress: string, amount: string, receiver?: string): string {
  return encodeFunctionData({
    abi: [{
      inputs: [
        { name: 'amount', type: 'uint256' },
        { name: 'receiver', type: 'address' }
      ],
      name: 'deposit',
      type: 'function'
    }],
    functionName: 'deposit',
    args: [amount, receiver || '0x0000000000000000000000000000000000000000']
  });
}

/**
 * Generates calldata for vault withdrawal
 * @param vaultAddress Vault contract address
 * @param amount Amount of tokens to withdraw
 * @param receiver Recipient address (optional)
 * @param owner Owner address (optional)
 * @returns Encoded calldata
 */
export function generateWithdrawCalldata(vaultAddress: string, amount: string, receiver?: string, owner?: string): string {
  return encodeFunctionData({
    abi: [{
      inputs: [
        { name: 'amount', type: 'uint256' },
        { name: 'receiver', type: 'address' },
        { name: 'owner', type: 'address' }
      ],
      name: 'withdraw',
      type: 'function'
    }],
    functionName: 'withdraw',
    args: [
      amount,
      receiver || '0x0000000000000000000000000000000000000000',
      owner || '0x0000000000000000000000000000000000000000'
    ]
  });
}

/**
 * Generates calldata for claiming rewards
 * @param account Account address
 * @param claimable Claimable amount
 * @param proof Merkle proof
 * @returns Encoded calldata
 */
export function generateClaimRewardsCalldata(account: string, claimable: string, proof: string[]): string {
  return encodeFunctionData({
    abi: [{
      inputs: [
        { name: 'account', type: 'address' },
        { name: 'claimable', type: 'uint256' },
        { name: 'proof', type: 'bytes32[]' }
      ],
      name: 'claim',
      type: 'function'
    }],
    functionName: 'claim',
    args: [account, claimable, JSON.parse(proof.join(','))]
  });
}

/**
 * Generates calldata for supplying collateral
 * @param marketParamsEncoded Encoded market parameters
 * @param assets Amount of tokens to supply
 * @param onBehalf Address to supply on behalf of (optional)
 * @returns Encoded calldata
 */
export function generateSupplyCollateralCalldata(marketParamsEncoded: string, assets: string, onBehalf?: string): string {
  return encodeFunctionData({
    abi: [{
      inputs: [
        { name: 'marketParams', type: 'bytes32' },
        { name: 'assets', type: 'uint256' },
        { name: 'onBehalf', type: 'address' }
      ],
      name: 'supplyCollateral',
      type: 'function'
    }],
    functionName: 'supplyCollateral',
    args: [
      marketParamsEncoded,
      assets,
      onBehalf || '0x0000000000000000000000000000000000000000'
    ]
  });
}

/**
 * Generates calldata for borrowing
 * @param marketParamsEncoded Encoded market parameters
 * @param assets Amount of tokens to borrow
 * @param receiver Recipient address
 * @param onBehalf Address to borrow on behalf of (optional)
 * @returns Encoded calldata
 */
export function generateBorrowCalldata(marketParamsEncoded: string, assets: string, receiver: string, onBehalf?: string): string {
  return encodeFunctionData({
    abi: [{
      inputs: [
        { name: 'marketParams', type: 'bytes32' },
        { name: 'assets', type: 'uint256' },
        { name: 'receiver', type: 'address' },
        { name: 'onBehalf', type: 'address' }
      ],
      name: 'borrow',
      type: 'function'
    }],
    functionName: 'borrow',
    args: [
      marketParamsEncoded,
      assets,
      receiver,
      onBehalf || '0x0000000000000000000000000000000000000000'
    ]
  });
}

/**
 * Generates calldata for repayment
 * @param marketParamsEncoded Encoded market parameters
 * @param assets Amount of tokens to repay
 * @param onBehalf Address to repay on behalf of (optional)
 * @returns Encoded calldata
 */
export function generateRepayCalldata(marketParamsEncoded: string, assets: string, onBehalf?: string): string {
  return encodeFunctionData({
    abi: [{
      inputs: [
        { name: 'marketParams', type: 'bytes32' },
        { name: 'assets', type: 'uint256' },
        { name: 'onBehalf', type: 'address' }
      ],
      name: 'repay',
      type: 'function'
    }],
    functionName: 'repay',
    args: [
      marketParamsEncoded,
      assets,
      onBehalf || '0x0000000000000000000000000000000000000000'
    ]
  });
}

/**
 * Generates calldata for withdrawing collateral
 * @param marketParamsEncoded Encoded market parameters
 * @param assets Amount of tokens to withdraw
 * @param receiver Recipient address
 * @param onBehalf Address to withdraw on behalf of (optional)
 * @returns Encoded calldata
 */
export function generateWithdrawCollateralCalldata(marketParamsEncoded: string, assets: string, receiver: string, onBehalf?: string): string {
  return encodeFunctionData({
    abi: [{
      inputs: [
        { name: 'marketParams', type: 'bytes32' },
        { name: 'assets', type: 'uint256' },
        { name: 'receiver', type: 'address' },
        { name: 'onBehalf', type: 'address' }
      ],
      name: 'withdrawCollateral',
      type: 'function'
    }],
    functionName: 'withdrawCollateral',
    args: [
      marketParamsEncoded,
      assets,
      receiver,
      onBehalf || '0x0000000000000000000000000000000000000000'
    ]
  });
}
