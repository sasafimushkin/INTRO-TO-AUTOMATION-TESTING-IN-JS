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
    const typeOfVariable = typeof number;

    if (typeOfVariable !== 'number') {
      throw new Error(`[${number}] is not of type "Number" it is of type "${typeOfVariable}"`);
    }

    return number % 2 === 0;
  }

  /**
   * Filters an array and returns only even numbers.
   * @param {Array<number>} arrayOfNumbers
   * @return {Array<number>}
   */
  getEvenNumbersFromArray(arrayOfNumbers) {
    if (Array.isArray(arrayOfNumbers)
      && arrayOfNumbers.every(item => typeof item === 'number')) {
      return arrayOfNumbers.filter(this.isNumberEven);
    }

    throw new Error(`[${arrayOfNumbers}] is not an array of "Numbers"`);
  }

  /**
   * Checks if all elements in an array are numbers.
   * @param {Array<number>} arrayOfNumbers
   * @return {boolean}
   */
  isAllNumbers(arrayOfNumbers) {
    if (!Array.isArray(arrayOfNumbers)) {
      throw new Error(`[${arrayOfNumbers}] is not an array`);
    }

    return arrayOfNumbers.every(n => typeof n === 'number');
  }

  /**
   * Checks if a number is an integer.
   * @param {number} n
   * @return {boolean}
   */
  isInteger(n) {
    if (typeof n !== 'number') {
      throw new Error(`[${n}] is not a number`);
    }

    return Number.isInteger(n);
  }
}

module.exports = NumbersValidator;
