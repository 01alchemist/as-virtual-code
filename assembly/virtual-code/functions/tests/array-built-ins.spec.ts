import { JSON } from "assemblyscript-json";
import { EvaluationContext, EvaluationStore } from "../..";
import { Value } from "../../types";
import { $in, $nin, $sort } from "../array-built-ins";
import {
  jsonToArray,
  jsonToBoolean,
  jsonToInt32,
  jsonToNumber,
  jsonToString,
} from "../utils";
import { f, i, Null, o, s } from "./utils";

const context = new EvaluationContext();
const store = new EvaluationStore();

describe("Array built-ins standalone test suite", () => {
  describe("$in tests", () => {
    describe("When passing an invalid array", () => {
      it("Should return false", () => {
        expect(jsonToBoolean($in([i(1), Null()], context, store))).toBeFalsy();
        expect(
          jsonToBoolean($in([s("str3"), Null()], context, store))
        ).toBeFalsy();
      });
    });
    describe("When passing a single value not present in the target array", () => {
      it("Should return false", () => {
        const array = o(`[2, 3, 4, 5, "str1", "str2"]`);
        expect(jsonToBoolean($in([i(1), array], context, store))).toBeFalsy();
        expect(
          jsonToBoolean($in([s("str3"), array], context, store))
        ).toBeFalsy();
      });
    });

    describe("When passing a single value present in the target array", () => {
      it("Should return true", () => {
        const array = o(`[2, 3, 4, 5, "str1", "str2"]`);

        expect(
          jsonToBoolean($in([s("str1"), array], context, store))
        ).toBeTruthy();
      });
    });

    describe("When passing multiple values that not present in the target array", () => {
      it("Should return false", () => {
        const array = o(`[2, 3, 4, 5, "str1", "str2"]`);

        expect(
          jsonToBoolean($in([i(-1), i(0), i(1), array], context, store))
        ).toBeFalsy();
        expect(
          jsonToBoolean($in([s("str3"), s("str4"), array], context, store))
        ).toBeFalsy();
      });
    });

    describe("When passing multiple values that present in the target array", () => {
      it("Should return true", () => {
        const array = o(`[2, 3, 4, 5, "str1", "str2"]`);

        expect(
          jsonToBoolean($in([i(4), i(3), array], context, store))
        ).toBeTruthy();
        expect(
          jsonToBoolean($in([s("str1"), s("str2"), array], context, store))
        ).toBeTruthy();
      });
    });

    describe("When passing multiple values that partially present in the target array", () => {
      it("Should return false", () => {
        const array = o(`[2, 3, 4, 5, "str1", "str2"]`);

        expect(
          jsonToBoolean($in([i(1), i(2), i(3), array], context, store))
        ).toBeFalsy();
        expect(
          jsonToBoolean($in([s("str2"), s("str3"), array], context, store))
        ).toBeFalsy();
      });
    });
  });

  describe("$nin tests", () => {
    describe("When passing a single value not present in the target array", () => {
      it("Should return true", () => {
        const array = o(`[2, 3, 4, 5, "str1", "str2"]`);

        expect(jsonToBoolean($nin([i(1), array], context, store))).toBeTruthy();
        expect(
          jsonToBoolean($nin([s("str3"), array], context, store))
        ).toBeTruthy();
      });
    });

    describe("When passing a single value present in the target array", () => {
      it("Should return false", () => {
        const array = o(`[2, 3, 4, 5, "str1", "str2"]`);

        expect(jsonToBoolean($nin([i(2), array], context, store))).toBeFalsy();
        expect(
          jsonToBoolean($nin([s("str1"), array], context, store))
        ).toBeFalsy();
      });
    });

    describe("When passing multiple values that not present in the target array", () => {
      it("Should return true", () => {
        const array = o(`[2, 3, 4, 5, "str1", "str2"]`);

        expect(
          jsonToBoolean($nin([i(-1), i(0), i(1), array], context, store))
        ).toBeTruthy();
        expect(
          jsonToBoolean($nin([s("str3"), s("str4"), array], context, store))
        ).toBeTruthy();
      });
    });

    describe("When passing multiple values that present in the target array", () => {
      it("Should return false", () => {
        const array = o(`[2, 3, 4, 5, "str1", "str2"]`);

        expect(
          jsonToBoolean($nin([i(2), i(3), array], context, store))
        ).toBeFalsy();
        expect(
          jsonToBoolean($nin([s("str1"), s("str2"), array], context, store))
        ).toBeFalsy();
      });
    });

    describe("When passing multiple values that partially present in the target array", () => {
      it("Should return true", () => {
        const array = o(`[2, 3, 4, 5, "str1", "str2"]`);

        expect(
          jsonToBoolean($nin([i(1), i(2), i(3), array], context, store))
        ).toBeTruthy();
        expect(
          $nin([s("str1"), s("str2"), s("str3"), array], context, store)
        ).toBeTruthy();
      });
    });
  });

  describe("$sort tests", () => {
    // FIXME: This should throw an error65
    // describe("When passing an invalid array", () => {
    //   it("Should return input value", () => {
    //     const array: any = o(`{}`);
    //     expect(jsonToArray($sort([array], context, store))).toBe(array);
    //   });
    // });
    describe("When passing an unknown element type", () => {
      it("Should throw error", () => {
        expect(() => {
          const type = "unknown-type";
          const array = o(`[1]`);
          $sort([array, i(0), s(type)], context, store);
        }).toThrow();
      });
    });
    describe("When passing an unsorted number array", () => {
      it("Should return sorted array", () => {
        const array = o(`[34, 456, 8, 30, 246, 32, 26, 31, 25]`);

        const result = jsonToArray<Value>(
          $sort([array], context, store)
        ).map<i32>((value: Value) => jsonToInt32(value));
        const sortedArray = [246, 25, 26, 30, 31, 32, 34, 456, 8];
        expect<i32[]>(result).toStrictEqual(sortedArray);
      });
    });

    describe("When passing an unsorted number string array", () => {
      it("Should return sorted array", () => {
        const array = o(
          `["34", "456", "8", "30", "246", "32", "26", "31", "25"]`
        );
        const result = jsonToArray<Value>(
          $sort([array], context, store)
        ).map<string>((value: Value) => jsonToString(value));
        const sortedArray = [
          "246",
          "25",
          "26",
          "30",
          "31",
          "32",
          "34",
          "456",
          "8",
        ];
        expect<string[]>(result).toStrictEqual(sortedArray);
      });
    });

    describe("When passing an unsorted Uint32Array", () => {
      it("Should return sorted Uint32Array", () => {
        const array = o(`[34, 456, 8, 30, 246, 32, 26, 31, 25]`);
        const result = jsonToArray<Value>(
          $sort([array, i(0), s("u32")], context, store)
        ).map<i32>((value: Value) => jsonToInt32(value));
        const sortedArray = [8, 25, 26, 30, 31, 32, 34, 246, 456];
        expect<i32[]>(result).toStrictEqual(sortedArray);
      });
    });

    describe("When passing an unsorted Int32Array", () => {
      it("Should return sorted Int32Array", () => {
        const array = o(`[34, 456, -8, 30, 246, 32, 26, 31, 25]`);

        const result = jsonToArray<JSON.Integer>(
          $sort([array, i(0), s("i32")], context, store)
        ).map<i32>((value: JSON.Integer) => jsonToInt32(value));
        const sortedArray = [-8, 25, 26, 30, 31, 32, 34, 246, 456];
        expect<i32[]>(result).toStrictEqual(sortedArray);
      });
    });

    describe("When passing an unsorted Float32Array", () => {
      it("Should return sorted Float32Array", () => {
        const array = o(`[
          34.56, 456.46, 8.164, 30.685, 246.165, 32.614, 26.6154, 31.124,
          25.1656,
        ];`);

        const result = jsonToArray<JSON.Num>(
          $sort([array, i(0), s("f32")], context, store)
        ).map<f64>((value: JSON.Num) => jsonToNumber(value));
        const sortedArray = [
          8.164, 25.1656, 26.6154, 30.685, 31.124, 32.614, 34.56, 246.165,
          456.46,
        ];
        expect<f64[]>(result).toStrictEqual(sortedArray);
      });
    });

    describe("When passing an unsorted float 32 string array", () => {
      it("Should return sorted array using Float32Array.sort", () => {
        const array = o(`[
          "34.56",
          "456.46",
          "8.164",
          "30.685",
          "246.165",
          "32.614",
          "26.6154",
          "31.124",
          "25.1656",
        ];`);

        const result = jsonToArray<JSON.Str>(
          $sort([array, i(0), s("f32")], context, store)
        ).map<string>((value: JSON.Str) => jsonToString(value));
        const sortedArray = [
          "8.164",
          "25.1656",
          "26.6154",
          "30.685",
          "31.124",
          "32.614",
          "34.56",
          "246.165",
          "456.46",
        ];
        expect<string[]>(result).toStrictEqual(sortedArray);
      });
    });

    describe("When passing an unsorted Float64Array", () => {
      it("Should return sorted Float64Array", () => {
        const array = o(`[
          34.56, 456.46, 8.164, 30.685, 246.165, 32.614, 26.6154, 31.124,
          25.1656,
        ];`);

        const result = jsonToArray<JSON.Num>(
          $sort([array, i(0), s("f64")], context, store)
        ).map<f64>((value: JSON.Num) => jsonToNumber(value));
        const sortedArray = [
          8.164, 25.1656, 26.6154, 30.685, 31.124, 32.614, 34.56, 246.165,
          456.46,
        ];
        expect<f64[]>(result).toStrictEqual(sortedArray);
      });
    });

    describe("When passing an unsorted float 64 string array", () => {
      it("Should return sorted array using Float64Array.sort", () => {
        const array = o(`[
          "34.56",
          "456.46",
          "8.164",
          "30.685",
          "246.165",
          "32.614",
          "26.6154",
          "31.124",
          "25.1656",
        ];`);

        const result = jsonToArray<JSON.Str>(
          $sort([array, i(1), s("f64")], context, store)
        ).map<string>((value: JSON.Str) => jsonToString(value));
        const sortedArray = [
          "8.164",
          "25.1656",
          "26.6154",
          "30.685",
          "31.124",
          "32.614",
          "34.56",
          "246.165",
          "456.46",
        ];
        expect<string[]>(result).toStrictEqual(sortedArray);
      });
    });

    describe("When passing an unsorted array and ascending sort order", () => {
      it("Should return sorted array in ascending order", () => {
        const array = o(`[34, 456, 8, 30, 30, 246, 32, 26, 31, 25]`);

        const result = jsonToArray<JSON.Integer>(
          $sort([array, i(1), s("i32")], context, store)
        ).map<i32>((value: JSON.Integer) => jsonToInt32(value));
        const sortedArray = [8, 25, 26, 30, 30, 31, 32, 34, 246, 456];
        expect<i32[]>(result).toStrictEqual(sortedArray);
      });
    });

    describe("When passing an unsorted string array and ascending sort order", () => {
      it("Should return sorted array in ascending order", () => {
        const array = o(`["Banana", "Orange", "Apple", "Mango"]`);

        const result = jsonToArray<JSON.Str>(
          $sort([array, i(1)], context, store)
        ).map<string>((value: JSON.Str) => jsonToString(value));
        const sortedArray = ["Apple", "Banana", "Mango", "Orange"];
        expect<string[]>(result).toStrictEqual(sortedArray);
      });
    });
    describe("When passing an unsorted array and descending sort order", () => {
      it("Should return sorted array in descending order", () => {
        const array = o(`[34, 456, 8, 30, 30, 246, 32, 26, 31, 25]`);

        const result = jsonToArray<JSON.Integer>(
          $sort([array, i(-1), s("i32")], context, store)
        ).map<i32>((value: Value) => jsonToInt32(value));
        const sortedArray = [456, 246, 34, 32, 31, 30, 30, 26, 25, 8];
        expect<i32[]>(result).toStrictEqual(sortedArray);
      });
    });
    describe("When passing an unsorted string array and descending sort order", () => {
      it("Should return sorted array in descending order", () => {
        const array = o(`["Banana", "Orange", "Apple", "Mango"]`);

        const result = jsonToArray<JSON.Str>(
          $sort([array, i(-1)], context, store)
        ).map<string>((value: JSON.Str) => jsonToString(value));
        const sortedArray = ["Orange", "Mango", "Banana", "Apple"];
        expect<string[]>(result).toStrictEqual(sortedArray);
      });
    });
  });
});
