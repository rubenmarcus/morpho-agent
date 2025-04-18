import { validateAddress, validateAmount, validateLltv, validateMarketParams } from '../utils/validation';

describe('Validation Utilities', () => {
  describe('validateAddress', () => {
    it('should validate correct Ethereum addresses', () => {
      expect(validateAddress('0x1234567890123456789012345678901234567890')).toBe(true);
      expect(validateAddress('0x0000000000000000000000000000000000000000')).toBe(true);
    });

    it('should reject invalid Ethereum addresses', () => {
      expect(validateAddress('0x123')).toBe(false);
      expect(validateAddress('1234567890123456789012345678901234567890')).toBe(false);
      expect(validateAddress('')).toBe(false);
    });
  });

  describe('validateAmount', () => {
    it('should validate correct amounts', () => {
      expect(validateAmount('100')).toBe(true);
      expect(validateAmount('100.5')).toBe(true);
      expect(validateAmount('0.1')).toBe(true);
    });

    it('should reject invalid amounts', () => {
      expect(validateAmount('abc')).toBe(false);
      expect(validateAmount('-100')).toBe(false);
      expect(validateAmount('')).toBe(false);
    });
  });

  describe('validateLltv', () => {
    it('should validate correct LLTV values', () => {
      expect(validateLltv('100').isValid).toBe(true);
      expect(validateLltv('50').isValid).toBe(true);
      expect(validateLltv('1').isValid).toBe(true);
    });

    it('should reject invalid LLTV values', () => {
      expect(validateLltv('0').isValid).toBe(false);
      expect(validateLltv('-1').isValid).toBe(false);
      expect(validateLltv('abc').isValid).toBe(false);
    });
  });

  describe('validateMarketParams', () => {
    it('should validate correct market parameters', () => {
      const validParams = {
        morphoAddress: '0x1234567890123456789012345678901234567890',
        loanToken: '0x1234567890123456789012345678901234567890',
        collateralToken: '0x1234567890123456789012345678901234567890',
        oracle: '0x1234567890123456789012345678901234567890',
        irm: '0x1234567890123456789012345678901234567890'
      };
      expect(validateMarketParams(validParams)).toBe(true);
    });

    it('should reject invalid market parameters', () => {
      const invalidParams = {
        morphoAddress: '0x123',
        loanToken: '0x1234567890123456789012345678901234567890',
        collateralToken: '0x1234567890123456789012345678901234567890',
        oracle: '0x1234567890123456789012345678901234567890',
        irm: '0x1234567890123456789012345678901234567890'
      };
      expect(validateMarketParams(invalidParams)).toBe(false);
    });
  });
});