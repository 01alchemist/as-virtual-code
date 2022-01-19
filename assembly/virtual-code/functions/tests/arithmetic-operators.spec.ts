import { EvaluationContext, EvaluationStore } from "../..";
import { $add, $subtract, $multiply, $divide } from "../arithmetic-operators";
import { jsonToNumber } from "../utils";
import { f } from "./utils";

const context = new EvaluationContext();
const store = new EvaluationStore();

describe("Arithmetic operators standalone test suite", () => {
  /**
   * `$add` Addition operator tests
   */
  describe("$add operator tests", () => {
    /**
     * When passing a single argument
     */
    describe("$add:[123.123]", () => {
      /**
       * It should return the same number
       */
      describe("should return the same Number", () => {
        it("[123.123]", () => {
          expect(jsonToNumber($add([f(123.123)], context, store))).toBe(
            123.123
          );
        });
      });
    });
    /**
     * When passing +ve numbers as first and second operands to $add operator
     */
    describe("$add:[+ve, +ve]", () => {
      /**
       * It should return postive sum of first and second numbers
       */
      describe("should return +ve Number", () => {
        it("[1, 1]", () => {
          expect(jsonToNumber($add([f(1), f(1)], context, store))).toBe(2);
        });
      });
    });

    /**
     * When passing -ve big number as first operand and +ve small number as
     * second operand to $add operator
     */
    describe("$add:[-big, +small]", () => {
      /**
       * should return negative difference between first and second numbers
       */
      describe("should return -ve Number", () => {
        it("[-150, 100]", () => {
          expect(jsonToNumber($add([f(-150), f(100)], context, store))).toBe(
            -50
          );
        });
      });
    });

    /**
     * When passing +ve small number as first operand and -ve big number as
     * second operand to $add operator
     */
    describe("$add:[+small, -big]", () => {
      /**
       * should return negative difference between second and first numbers
       */
      describe("should return -ve Number", () => {
        it("[100, -150]", () => {
          expect(jsonToNumber($add([f(100), f(-150)], context, store))).toBe(
            -50
          );
        });
      });
    });

    /**
     * When passing +ve big number as first operand and -ve small number as
     * second operand to $add operator
     */
    describe("$add:[+big, -small]", () => {
      /**
       * should return positive difference between first and second numbers
       */
      describe("should return -ve Number", () => {
        it("[-150, 100]", () => {
          expect(jsonToNumber($add([f(-150), f(100)], context, store))).toBe(
            -50
          );
        });
      });
    });

    /**
     * When passing -ve small number as first operand and +ve big number as
     * second operand to $add operator
     */
    describe("$add:[-small, +big]", () => {
      /**
       * should return positive difference between second and first numbers
       */
      describe("should return +ve Number", () => {
        it("[-100, 150]", () => {
          expect(jsonToNumber($add([f(-100), f(150)], context, store))).toBe(
            50
          );
        });
      });
    });

    /**
     * When passing two -ve numbers as first and second operands to $add operator
     */
    describe("$add:[-ve, -ve]", () => {
      /**
       * should return negative sum of first and second numbers
       */
      describe("should return -ve Number", () => {
        it("[-100, -150]", () => {
          expect(jsonToNumber($add([f(-100), f(-150)], context, store))).toBe(
            -250
          );
        });
      });
    });

    /**
     * When passing same numbers with opposite signs as first and second operands to $add operator
     */
    describe("$add:[-100, +100]", () => {
      describe("should return zero", () => {
        it("[-100, 100]", () => {
          expect(jsonToNumber($add([f(-100), f(100)], context, store))).toBe(0);
        });
      });
    });
  });

  /**
   * `$subtract` Subtraction operator tests
   */
  describe("$subtract operator tests", () => {
    /**
     * When passing a single argument
     */
    describe("$subtract:[123]", () => {
      /**
       * It should return it's negative number
       */
      describe("should return -ve Number", () => {
        it("[-123]", () => {
          expect(jsonToNumber($subtract([f(123)], context, store))).toBe(-123);
        });
      });
    });
    /**
     * When passing big number as first operand and small number as second
     * operand to $subtract operator
     */
    describe("$subtract:[big, small]", () => {
      /**
       * It should return postive difference between first and second numbers
       */
      describe("should return +ve Number", () => {
        it("[150, 100]", () => {
          expect(
            jsonToNumber($subtract([f(150), f(100)], context, store))
          ).toBe(50);
        });
      });
    });

    /**
     * When passing small number as first operand and big number as second
     * operand to $subtract operator
     */
    describe("$subtract:[small, big]", () => {
      /**
       * should return negative difference between first and second numbers
       */
      describe("should return -ve Number", () => {
        it("[100, 150]", () => {
          expect(
            jsonToNumber($subtract([f(100), f(150)], context, store))
          ).toBe(-50);
        });
      });
    });

    /**
     * When passing same numbers as first and second operands to $subtract
     * operator
     */
    describe("$subtract:[100, 100]", () => {
      describe("should return zero", () => {
        it("[100, 100]", () => {
          expect(
            jsonToNumber($subtract([f(100), f(100)], context, store))
          ).toBe(0);
        });
      });
    });

    /**
     * When passing -ve small and +ve big as first and second operands to
     * $subtract operator
     */
    describe("$subtract:[-small, +big]", () => {
      /**
       * It should return negative sum of two numbers
       */
      describe("should return -ve Number", () => {
        it("[-100, 150]", () => {
          expect(
            jsonToNumber($subtract([f(-100), f(150)], context, store))
          ).toBe(-250);
        });
      });
    });

    /**
     * When passing -ve small and -ve big as first and second operands to
     * $subtract operator
     */
    describe("$subtract:[-small, -big]", () => {
      /**
       * It should return positive difference between second and first numbers
       */
      describe("should return +ve Number", () => {
        it("[-100, -150]", () => {
          expect(
            jsonToNumber($subtract([f(-100), f(-150)], context, store))
          ).toBe(50);
        });
      });
    });

    /**
     * When passing +ve small and -ve big as first and second operands to
     * $subtract operator
     */
    describe("$subtract:[+small, -big]", () => {
      /**
       * It should return positive sum of two numbers
       */
      describe("should return +ve Number", () => {
        it("[100, -150]", () => {
          expect(
            jsonToNumber($subtract([f(100), f(-150)], context, store))
          ).toBe(250);
        });
      });
    });

    /**
     * When passing +ve big and -ve small as first and second operands to
     * $subtract operator
     */
    describe("$subtract:[+big, -small]", () => {
      /**
       * It should return positive sum of two numbers
       */
      describe("should return +ve Number", () => {
        it("[150, -100]", () => {
          expect(
            jsonToNumber($subtract([f(150), f(-100)], context, store))
          ).toBe(250);
        });
      });
    });
  });

  /**
   * `$divide` Division operator tests
   */
  describe("$divide operator tests", () => {
    /**
     * When passing big number as first operand and small number as second
     * operand to $divide operator
     */
    describe("$divide:[big, small]", () => {
      /**
       * It should return postive number greater than 1
       */
      describe("should return x > +1", () => {
        it("[150, 100]", () => {
          expect(jsonToNumber($divide([f(150), f(100)], context, store))).toBe(
            1.5
          );
        });
      });
    });

    /**
     * When passing small number as first operand and big number as second
     * operand to $divide operator
     */
    describe("$divide:[small, big]", () => {
      /**
       * should return number between 0 and +1
       */
      describe("should return 0 < x < +1", () => {
        it("[100, 150]", () => {
          const result = jsonToNumber(
            $divide([f(100), f(150)], context, store)
          );
          expect(result).toBeLessThan(1);
          expect(result).toBeCloseTo(100 / 150);
        });
      });
    });

    /**
     * When passing same numbers as first and second operands to $divide
     * operator
     */
    describe("$divide:[100, 100]", () => {
      describe("should return one", () => {
        it("[100, 100]", () => {
          expect(jsonToNumber($divide([f(100), f(100)], context, store))).toBe(
            1
          );
        });
      });
    });

    /**
     * When passing -ve small and +ve big as first and second operands to
     * $divide operator
     */
    describe("$divide:[-small, +big]", () => {
      /**
       * It should return number between -1 and 0
       */
      describe("should return -1 < x < 0", () => {
        it("[-100, 150]", () => {
          const result = jsonToNumber(
            $divide([f(-100), f(150)], context, store)
          );
          expect(result).toBeLessThan(0);
          expect(result).toBeGreaterThan(-1);
          expect(result).toBeCloseTo(-100 / 150);
        });
      });
    });

    /**
     * When passing -ve small and -ve big as first and second operands to
     * $divide operator
     */
    describe("$divide:[-small, -big]", () => {
      /**
       * It should return number between 0 and +1
       */
      describe("should return 0 < x < +1", () => {
        it("[-100, -150]", () => {
          const result = jsonToNumber(
            $divide([f(-100), f(-150)], context, store)
          );
          expect(result).toBeLessThan(1);
          expect(result).toBeGreaterThan(0);
          expect(result).toBeCloseTo(-100 / -150);
        });
      });
    });

    /**
     * When passing +ve small and -ve big as first and second operands to
     * $divide operator
     */
    describe("$divide:[+small, -big]", () => {
      /**
       * It should return number between -1 and 0
       */
      describe("should return -1 < x < 0", () => {
        it("[100, -150]", () => {
          const result = jsonToNumber(
            $divide([f(100), f(-150)], context, store)
          );
          expect(result).toBeGreaterThan(-1);
          expect(result).toBeLessThan(0);
          expect(result).toBeCloseTo(100 / -150);
        });
      });
    });

    /**
     * When passing +ve big and -ve small as first and second operands to
     * $divide operator
     */
    describe("$divide:[+big, -small]", () => {
      /**
       * It should return number less than -1
       */
      describe("should return x < -1", () => {
        it("[150, -100]", () => {
          const result = jsonToNumber(
            $divide([f(150), f(-100)], context, store)
          );
          expect(result).toBe(150 / -100);
        });
      });
    });
  });

  /**
   * `$multiply` Division operator tests
   */
  describe("$multiply operator tests", () => {
    /**
     * When passing two +ve numbers as operands to $multiply operator
     */
    describe("$multiply:[+ve, +ve]", () => {
      describe("should return a postive number", () => {
        it("[150, 100]", () => {
          expect(
            jsonToNumber($multiply([f(150), f(100)], context, store))
          ).toBe(150 * 100);
        });
      });
    });

    /**
     * When passing two -ve numbers as operands to $multiply operator
     */
    describe("$multiply:[-ve, -ve]", () => {
      describe("should return a postive number", () => {
        it("[-100, -150]", () => {
          expect(
            jsonToNumber($multiply([f(-100), f(-150)], context, store))
          ).toBe(-100 * -150);
        });
      });
    });

    /**
     * When passing two numbers with opposite signs as operands to $multiply
     * operator
     */
    describe("$multiply:[-ve, +ve]", () => {
      describe("should return a negative number", () => {
        it("[100, -150]", () => {
          expect(
            jsonToNumber($multiply([f(100), f(-150)], context, store))
          ).toBe(100 * -150);
        });
      });
    });
  });

  /* end */
});
