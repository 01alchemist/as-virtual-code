import { EvaluationContext, EvaluationStore } from "../..";
import { $eq, $ne, $gt, $gte, $lt, $lte } from "../comparison-operators";
import { jsonToBoolean } from "../utils";
import { b, f, Null, o, s } from "./utils";

const context = new EvaluationContext();
const store = new EvaluationStore();

describe("Comparison operators standalone test suite", () => {
  /**
   * `$eq` Equal to operator tests
   */
  describe("$eq operator tests", () => {
    describe("When comparing null with null", () => {
      it("should return true", () => {
        expect(
          jsonToBoolean($eq([Null(), Null(), b(false)], context, store))
        ).toBeTruthy();
      });
    });
    describe("When strict comparing null with null", () => {
      it("should return true", () => {
        expect(
          jsonToBoolean($eq([Null(), Null(), b(true)], context, store))
        ).toBeTruthy();
      });
    });
    // Undefined is not supported
    /* describe("When comparing undefined with undefined", () => {
      it("should return true", () => {
        expect(jsonToBoolean($eq([undefined, undefined, b(false)], context, store))).toBeTruthy();
      });
    }); 
    describe("When strict comparing undefined with undefined", () => {
      it("should return true", () => {
        expect(jsonToBoolean($eq([undefined, undefined, b(true)], context, store))).toBeTruthy();
      });
    });
    describe("When comparing undefined with null", () => {
      it("should return true", () => {
        expect(jsonToBoolean($eq([undefined, Null(), b(false)], context, store))).toBeTruthy();
      });
    });
    describe("When strict comparing undefined with null", () => {
      it("should return false", () => {
        expect(jsonToBoolean($eq([undefined, Null(), b(true)], context, store))).toBeFalsy();
      });
    });*/
    describe("When strict comparing null with {}", () => {
      it("should return false", () => {
        expect(
          jsonToBoolean($eq([Null(), o("{}"), b(true)], context, store))
        ).toBeFalsy();
      });
    });
    describe("When comparing null with {}", () => {
      it("should return false", () => {
        expect(
          jsonToBoolean($eq([Null(), o("{}"), b(false)], context, store))
        ).toBeFalsy();
      });
    });
    describe("When comparing true with 1", () => {
      it("should return true", () => {
        expect(
          jsonToBoolean($eq([b(true), f(1), b(false)], context, store))
        ).toBeTruthy();
      });
    });
    describe("When strict comparing true with 1", () => {
      it("should return false", () => {
        expect(
          jsonToBoolean($eq([b(true), f(1), b(true)], context, store))
        ).toBeFalsy();
      });
    });
    describe("When comparing false with empty string", () => {
      it("should return true", () => {
        expect(
          jsonToBoolean($eq([b(false), s(""), b(false)], context, store))
        ).toBeTruthy();
      });
    });
    describe("When strict comparing false with empty string", () => {
      it("should return false", () => {
        expect(
          jsonToBoolean($eq([b(false), s(""), b(true)], context, store))
        ).toBeFalsy();
      });
    });
    describe("When comparing false with 0", () => {
      it("should return true", () => {
        expect(
          jsonToBoolean($eq([b(false), f(0), b(false)], context, store))
        ).toBeTruthy();
      });
    });
    describe("When strict comparing false with 0", () => {
      it("should return false", () => {
        expect(
          jsonToBoolean($eq([b(false), f(0), b(true)], context, store))
        ).toBeFalsy();
      });
    });
    describe("When comparing false with '0'", () => {
      it("should return true", () => {
        expect(
          jsonToBoolean($eq([b(false), s("0"), b(false)], context, store))
        ).toBeTruthy();
      });
    });
    describe("When strict comparing false with '0'", () => {
      it("should return false", () => {
        expect(
          jsonToBoolean($eq([b(false), s("0"), b(true)], context, store))
        ).toBeFalsy();
      });
    });
    describe("When comparing same string", () => {
      it("should return true", () => {
        expect(
          $eq([s("some-string"), s("some-string"), b(false)], context, store)
        ).toBeTruthy();
      });
    });
    describe("When strict comparing same string", () => {
      it("should return true", () => {
        expect(
          $eq([s("some-string"), s("some-string"), b(true)], context, store)
        ).toBeTruthy();
      });
    });
    describe("When comparing same numbers", () => {
      it("should return true", () => {
        expect(
          jsonToBoolean($eq([f(1538), f(1538), b(false)], context, store))
        ).toBeTruthy();
      });
    });
    describe("When strict comparing same numbers", () => {
      it("should return true", () => {
        expect(
          jsonToBoolean($eq([f(1538), f(1538), b(true)], context, store))
        ).toBeTruthy();
      });
    });
    describe("When comparing same string and number", () => {
      it("should return true", () => {
        expect(
          jsonToBoolean($eq([f(1538), s("1538"), b(false)], context, store))
        ).toBeTruthy();
      });
    });
    describe("When strict comparing string and number", () => {
      it("should return false", () => {
        expect(
          jsonToBoolean($eq([f(1538), s("1538"), b(true)], context, store))
        ).toBeFalsy();
      });
    });
    describe("When strict comparing same objects", () => {
      it("should return true", () => {
        const obj = o(`{ "key": "value" }`);
        expect(
          jsonToBoolean($eq([obj, obj, b(true)], context, store))
        ).toBeTruthy();
      });
    });
    describe("When non-strict comparing same objects", () => {
      it("should return true", () => {
        const obj = o(`{ "key": "value" }`);
        expect(
          jsonToBoolean($eq([obj, obj, b(false)], context, store))
        ).toBeTruthy();
      });
    });
    describe("When strict comparing similar objects", () => {
      it("should return false", () => {
        const obj1 = o(`{ "key": "value" }`);
        const obj2 = o(`{ "key": "value" }`);
        expect(
          jsonToBoolean($eq([obj1, obj2, b(true)], context, store))
        ).toBeFalsy();
      });
    });
    describe("When non-strict comparing similar objects", () => {
      it("should return true", () => {
        const obj1 = o(`{ "key": "value" }`);
        const obj2 = o(`{ "key": "value" }`);
        expect(
          jsonToBoolean($eq([obj1, obj2, b(false)], context, store))
        ).toBeTruthy();
      });
    });
    describe("When comparing objects with different number of keys", () => {
      it("should return false", () => {
        const obj1 = o(`{ "key": "value" }`);
        const obj2 = o(`{ "key": "value", "key2": "value" }`);
        expect(
          jsonToBoolean($eq([obj1, obj2, b(false)], context, store))
        ).toBeFalsy();
      });
    });
    describe("When comparing same array", () => {
      it("should return true", () => {
        const arr1 = o(`[1]`);
        const arr2 = o(`[1]`);
        expect(
          jsonToBoolean($eq([arr1, arr2, b(false)], context, store))
        ).toBeTruthy();
      });
    });
    describe("When comparing different array", () => {
      it("should return false", () => {
        const arr1 = o(`[1]`);
        const arr2 = o(`[1, 2]`);
        expect(
          jsonToBoolean($eq([arr1, arr2, b(false)], context, store))
        ).toBeFalsy();
      });
    });
  });

  /**
   * `$ne` Not equal to operator tests
   */
  describe("$ne operator tests", () => {
    /* describe("When comparing undefined with undefined", () => {
      it("should return false", () => {
        expect(jsonToBoolean($ne([undefined, undefined], context, store))).toBeFalsy();
      });
    });
    describe("When strict comparing undefined with undefined", () => {
      it("should return false", () => {
        expect(jsonToBoolean($ne([undefined, undefined, b(true)], context, store))).toBeFalsy();
      });
    });
    describe("When comparing undefined with null", () => {
      it("should return false", () => {
        expect(jsonToBoolean($ne([undefined, Null(), b(false)], context, store))).toBeFalsy();
      });
    });
    describe("When strict comparing undefined with null", () => {
      it("should return true", () => {
        expect(jsonToBoolean($ne([undefined, Null(), b(true)], context, store))).toBeTruthy();
      });
    }); */
    describe("When comparing true with 1", () => {
      it("should return false", () => {
        expect(
          jsonToBoolean($ne([b(true), f(1), b(false)], context, store))
        ).toBeFalsy();
      });
    });
    describe("When strict comparing true with 1", () => {
      it("should return true", () => {
        expect(
          jsonToBoolean($ne([b(true), f(1), b(true)], context, store))
        ).toBeTruthy();
      });
    });
    describe("When comparing false with empty string", () => {
      it("should return false", () => {
        expect(
          jsonToBoolean($ne([b(false), s(""), b(false)], context, store))
        ).toBeFalsy();
      });
    });
    describe("When strict comparing false with empty string", () => {
      it("should return true", () => {
        expect(
          jsonToBoolean($ne([b(false), s(""), b(true)], context, store))
        ).toBeTruthy();
      });
    });
    describe("When comparing false with 0", () => {
      it("should return false", () => {
        expect(
          jsonToBoolean($ne([b(false), f(0), b(false)], context, store))
        ).toBeFalsy();
      });
    });
    describe("When strict comparing false with 0", () => {
      it("should return true", () => {
        expect(
          jsonToBoolean($ne([b(false), f(0), b(true)], context, store))
        ).toBeTruthy();
      });
    });
    describe("When comparing false with '0'", () => {
      it("should return false", () => {
        expect(
          jsonToBoolean($ne([b(false), s("0"), b(false)], context, store))
        ).toBeFalsy();
      });
    });
    describe("When strict comparing false with '0'", () => {
      it("should return true", () => {
        expect(
          jsonToBoolean($ne([b(false), s("0"), b(true)], context, store))
        ).toBeTruthy();
      });
    });
    describe("When comparing same string", () => {
      it("should return true", () => {
        expect(
          $ne([s("some-string"), s("some-string"), b(false)], context, store)
        ).toBeFalsy();
      });
    });
    describe("When strict comparing same string", () => {
      it("should return true", () => {
        expect(
          $ne([s("some-string"), s("some-string"), b(true)], context, store)
        ).toBeFalsy();
      });
    });
    describe("When comparing same numbers", () => {
      it("should return true", () => {
        expect(
          jsonToBoolean($ne([f(1538), f(1538), b(false)], context, store))
        ).toBeFalsy();
      });
    });
    describe("When strict comparing same numbers", () => {
      it("should return true", () => {
        expect(
          jsonToBoolean($ne([f(1538), f(1538), b(true)], context, store))
        ).toBeFalsy();
      });
    });
    describe("When comparing same string and number", () => {
      it("should return true", () => {
        expect(
          jsonToBoolean($ne([f(1538), s("1538"), b(false)], context, store))
        ).toBeFalsy();
      });
    });
    describe("When strict comparing string and number", () => {
      it("should return false", () => {
        expect(
          jsonToBoolean($ne([f(1538), s("1538"), b(true)], context, store))
        ).toBeTruthy();
      });
    });
  });

  /**
   * `$gt` Greater than operator tests
   */
  describe("$gt operator tests", () => {
    describe("When passing greater first operand than second operand to $gt comparison", () => {
      it("should return true", () => {
        expect(
          jsonToBoolean($gt([f(150), f(100)], context, store))
        ).toBeTruthy();
      });
    });
    describe("When passing lesser first operand than second operand to $gt comparison", () => {
      it("should return false", () => {
        expect(jsonToBoolean($gt([f(50), f(100)], context, store))).toBeFalsy();
      });
    });
    describe("When passing equal operands to $gt comparison", () => {
      it("should return false", () => {
        expect(
          jsonToBoolean($gt([f(100), f(100)], context, store))
        ).toBeFalsy();
      });
    });
  });

  /**
   * `$gte` Greater than or equal to operator tests
   */
  describe("$gte operator tests", () => {
    describe("When passing greater first operand than second operand to $gte comparison", () => {
      it("should return true", () => {
        expect(
          jsonToBoolean($gte([f(150), f(100)], context, store))
        ).toBeTruthy();
      });
    });
    describe("When passing lesser first operand than second operand to $gte comparison", () => {
      it("should return false", () => {
        expect(
          jsonToBoolean($gte([f(50), f(100)], context, store))
        ).toBeFalsy();
      });
    });
    describe("When passing equal operands to $gte comparison", () => {
      it("should return true", () => {
        expect(
          jsonToBoolean($gte([f(100), f(100)], context, store))
        ).toBeTruthy();
      });
    });
  });

  /**
   * `$lt` Less than operator tests
   */
  describe("$lt operator tests", () => {
    describe("When passing greater first operand than second operand to $lt comparison", () => {
      it("should return false", () => {
        expect(
          jsonToBoolean($lt([f(150), f(100)], context, store))
        ).toBeFalsy();
      });
    });
    describe("When passing lesser first operand than second operand to $lt comparison", () => {
      it("should return true", () => {
        expect(
          jsonToBoolean($lt([f(50), f(100)], context, store))
        ).toBeTruthy();
      });
    });
    describe("When passing equal operands to $lt comparison", () => {
      it("should return false", () => {
        expect(
          jsonToBoolean($lt([f(100), f(100)], context, store))
        ).toBeFalsy();
      });
    });
  });

  /**
   * `$lte` Less than or equal to operator tests
   */
  describe("$lte operator tests", () => {
    describe("When passing greater first operand than second operand to $lte comparison", () => {
      it("should return false", () => {
        expect(
          jsonToBoolean($lte([f(150), f(100)], context, store))
        ).toBeFalsy();
      });
    });
    describe("When passing lesser first operand than second operand to $lte comparison", () => {
      it("should return false", () => {
        expect(
          jsonToBoolean($lte([f(50), f(100)], context, store))
        ).toBeTruthy();
      });
    });
    describe("When passing equal operands to $lte comparison", () => {
      it("should return true", () => {
        expect(
          jsonToBoolean($lte([f(100), f(100)], context, store))
        ).toBeTruthy();
      });
    });
  });

  /* end */
});
