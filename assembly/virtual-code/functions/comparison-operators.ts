/* tslint:disable triple-equals */

import { JSON } from "assemblyscript-json";
import { Value } from "../types";
import { EvaluationContext, EvaluationStore } from "..";
import { jsonToBoolean, jsonToNumber, jsonToString } from "./utils";

/**
 * Default strict equality check
 */
function eq(operands: Value[]): boolean {
  const operand1 = operands[0];
  const operand2 = operands[1];
  const operand3 = operands.length == 3 ? operands[2] : new JSON.Bool(true);
  const strict = jsonToBoolean(operand3, true);
  let result: boolean = false;

  if (operand1.isObj && operand2.isObj) {
    // operand 1 or operand 2 null
    if (operand1 === null || operand2 === null) {
      return operand1 == operand2;
    }
    // Array
    if (operand1.isArr && operand2.isArr) {
      const array1 = (<JSON.Arr>operand1).valueOf();
      const array2 = (<JSON.Arr>operand2).valueOf();
      if (array1.length !== array2.length) {
        result = false;
      } else {
        result = true;
        for (let i: i32 = 0; i < array1.length; i++) {
          const value = eq([array1[i], array2[i], operand3]);
          if (value == false) {
            result = false;
            break;
          }
        }
      }
    } else {
      // Object
      const object1 = (<JSON.Obj>operand1).valueOf();
      const object2 = (<JSON.Obj>operand2).valueOf();
      const keys1 = object1.keys();
      const keys2 = object2.keys();
      if (keys1.length !== keys2.length) {
        result = false;
      } else {
        result = true;
        for (let i: i32 = 0; i < keys1.length; i++) {
          const value = eq([
            object1.get(keys1[i]),
            object2.get(keys2[i]),
            operand3,
          ]);
          if (value == false) {
            result = false;
            break;
          }
        }
      }
    }
  } else if (strict) {
    if (
      (operand1.isNum || operand1.isInteger) &&
      (operand2.isNum || operand2.isInteger)
    ) {
      const left = jsonToNumber(operands[0]);
      const right = jsonToNumber(operands[1]);
      result = left == right;
    } else if (operand1.isString && operand2.isString) {
      const left = jsonToString(operands[0]);
      const right = jsonToString(operands[1]);
      result = left == right;
    } else if (operand1.isBool && operand2.isBool) {
      const left = jsonToBoolean(operands[0]);
      const right = jsonToBoolean(operands[1]);
      result = left == right;
    }
  } else {
    const left = operands[0].toString();
    const right = operands[1].toString();
    result = left == right;
  }

  return result;
}

export const $eq = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => new JSON.Bool(eq(operands));
export const $ne = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => new JSON.Bool(!eq(operands));

export const $gt = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  const operand1 = jsonToNumber(operands[0]);
  const operand2 = jsonToNumber(operands[1]);
  return new JSON.Bool(operand1 > operand2);
};

export const $lt = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  const operand1 = jsonToNumber(operands[0]);
  const operand2 = jsonToNumber(operands[1]);
  return new JSON.Bool(operand1 < operand2);
};

export const $gte = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  const operand1 = jsonToNumber(operands[0]);
  const operand2 = jsonToNumber(operands[1]);
  return new JSON.Bool(operand1 >= operand2);
};

export const $lte = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  const operand1 = jsonToNumber(operands[0]);
  const operand2 = jsonToNumber(operands[1]);
  return new JSON.Bool(operand1 <= operand2);
};

// export default comparisonOperators

// export type ComparisonOperators = typeof comparisonOperators;
// export type ComparisonOperatorKeys = keyof ComparisonOperators;
// export type ComparisonCode = {
//   [K in ComparisonOperatorKeys]?: (
//     | Parameters<ComparisonOperators[K]>[0][number]
//     | VirtualCode
//   )[];
// };
