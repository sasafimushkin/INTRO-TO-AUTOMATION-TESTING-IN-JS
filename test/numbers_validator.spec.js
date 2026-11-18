const { expect } = require('chai');
const NumbersValidator = require('../app/numbers_validator');

describe('NumbersValidator Unit Tests', () => {
  let validator;

  beforeEach(() => {
    validator = new NumbersValidator();
  });

  afterEach(() => {
    validator = null;
  });

  describe('isNumberEven', () => {
    it('should return true for even numbers', () => {
      expect(validator.isNumberEven(4)).to.equal(true);
      expect(validator.isNumberEven(0)).to.equal(true);
      expect(validator.isNumberEven(-2)).to.equal(true);
    });

    it('should return false for odd numbers', () => {
      expect(validator.isNumberEven(5)).to.equal(false);
      expect(validator.isNumberEven(-3)).to.equal(false);
    });

    it('should throw an error if passed value is not a number', () => {
      expect(() => validator.isNumberEven('4')).to.throw(
        '[4] is not of type "Number" it is of type "string"',
      );

      expect(() => validator.isNumberEven(null)).to.throw(
        '[null] is not of type "Number" it is of type "object"',
      );

      expect(() => validator.isNumberEven(undefined)).to.throw(
        '[undefined] is not of type "Number" it is of type "undefined"',
      );
    });
  });

  describe('isAllNumbers', () => {
    it('should return true when all elements are numbers', () => {
      expect(validator.isAllNumbers([1, 2, 3, 4])).to.equal(true);
      expect(validator.isAllNumbers([])).to.equal(true);
    });

    it('should return false if any element is not a number', () => {
      expect(validator.isAllNumbers([1, '2', 3])).to.equal(false);
      expect(validator.isAllNumbers([1, null, 3])).to.equal(false);
    });

    it('should throw an error if input is not an array', () => {
      expect(() => validator.isAllNumbers('not an array')).to.throw(
        '[not an array] is not an array',
      );

      expect(() => validator.isAllNumbers(123)).to.throw(
        '[123] is not an array',
      );
    });
  });

  describe('getEvenNumbersFromArray', () => {
    it('should return only even numbers from an array of numbers', () => {
      expect(
        validator.getEvenNumbersFromArray([1, 2, 3, 4, 5, 6]),
      ).to.deep.equal([2, 4, 6]);

      expect(
        validator.getEvenNumbersFromArray([1, 3, 5]),
      ).to.deep.equal([]);

      expect(
        validator.getEvenNumbersFromArray([2, 4, 8]),
      ).to.deep.equal([2, 4, 8]);

      expect(
        validator.getEvenNumbersFromArray([]),
      ).to.deep.equal([]);
    });

    it('should throw an error if input is not an array', () => {
      expect(() => validator.getEvenNumbersFromArray('hello')).to.throw(
        '[hello] is not an array of "Numbers"',
      );
    });

    it('should throw an error if array contains non-number elements', () => {
      expect(
        () => validator.getEvenNumbersFromArray([1, 2, 'three', 4]),
      ).to.throw(
        '[1,2,three,4] is not an array of "Numbers"',
      );
    });
  });

  describe('isInteger', () => {
    it('should return true for integer numbers', () => {
      expect(validator.isInteger(10)).to.equal(true);
      expect(validator.isInteger(0)).to.equal(true);
      expect(validator.isInteger(-5)).to.equal(true);
    });

    it('should return false for decimal numbers', () => {
      expect(validator.isInteger(10.5)).to.equal(false);
      expect(validator.isInteger(-3.14)).to.equal(false);
    });

    it('should throw an error if passed value is not a number', () => {
      expect(() => validator.isInteger('10')).to.throw(
        '[10] is not a number',
      );

      expect(() => validator.isInteger({})).to.throw(
        '[[object Object]] is not a number',
      );

      expect(() => validator.isInteger(null)).to.throw(
        '[null] is not a number',
      );
    });
  });
});
