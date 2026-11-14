/**
 * Class representing a numbers validator.
 */
class NumbersValidator {
  /**
   * Checks if a number is even.
   * @param {number} number
   * @return {boolean}
   */
  isNumberEven(number) {
    if (typeof number !== 'number') {
      throw new Error(`[${number}] is not of type "Number" it is of type "${typeof number}"`);
    }
    return number % 2 === 0;
  }

  /**
   * Filters an array and returns only even numbers.
   * @param {Array<number>} numbersArray
   * @return {Array<number>}
   */
  getEvenNumbersFromArray(numbersArray) {
    if (!Array.isArray(numbersArray)) {
      throw new Error(`[${numbersArray}] is not an array`);
    }
    if (!this.isAllNumbers(numbersArray)) {
      throw new Error(`[${numbersArray}] is not an array of "Numbers"`);
    }
    return numbersArray.filter((num) => this.isNumberEven(num));
  }

  /**
   * Checks if all elements in an array are numbers.
   * @param {Array<number>} numbersArray
   * @return {boolean}
   */
  isAllNumbers(numbersArray) {
    if (!Array.isArray(numbersArray)) {
      throw new Error(`[${numbersArray}] is not an array`);
    }
    return numbersArray.every((num) => typeof num === 'number');
  }

  /**
   * Checks if a number is an integer.
   * @param {number} number
   * @return {boolean}
   */
  isInteger(number) {
    if (typeof number !== 'number') {
      throw new Error(`[${number}] is not of type "Number" it is of type "${typeof number}"`);
    }
    return Number.isInteger(number);
  }
}

module.exports = NumbersValidator;
