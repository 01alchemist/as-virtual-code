import { Value } from "../types";
import { EvaluationContext, EvaluationStore } from "..";
import {
  jsonToInt32,
  jsonToNumber,
  map_f64,
  toJsonBoolean,
  toJsonNumber,
} from "./utils";

function pow(x: f64, y: i32): f64 {
  let temp: f64;
  if (y == 0) return 1;
  temp = pow(x, y / 2);
  if (y % 2 == 0) {
    return temp * temp;
  } else {
    if (y > 0) return x * temp * temp;
    else return (temp * temp) / x;
  }
}

export const $pow = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value =>
  toJsonNumber(pow(jsonToNumber(operands[0]), jsonToInt32(operands[1])));

export const $abs = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => toJsonNumber(abs(jsonToNumber(operands[0])));

function round(value: f64, precision: i32 = 0): f64 {
  return floor(pow(10, precision) * value) / pow(10, precision);
}

export const $round = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  if (operands.length == 2) {
    return toJsonNumber(
      round(jsonToNumber(operands[0]), jsonToInt32(operands[1]))
    );
  }
  return toJsonNumber(round(jsonToNumber(operands[0])));
};

export const $isNaN = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => toJsonBoolean(isNaN(jsonToNumber(operands[0])));

export const $min = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  const arr = map_f64(operands);
  let minValue = arr[0];
  for (let i = 1; i < arr.length; i++) {
    minValue = min(minValue, arr[i]);
  }
  return toJsonNumber(minValue);
};

export const $max = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  const arr = map_f64(operands);
  let maxValue = arr[0];
  for (let i = 1; i < arr.length; i++) {
    maxValue = max(maxValue, arr[i]);
  }
  return toJsonNumber(maxValue);
};

// export const mathBuiltIns = {
//   $abs,
//   $isNaN,
//   $min,
//   $max,
// };

// export default mathBuiltIns;

// export type MathBuiltIns = typeof mathBuiltIns;
// export type MathBuiltInKeys = keyof MathBuiltIns;
// export type MathBuiltInCode = {
//   [K in MathBuiltInKeys]?: (
//     | Parameters<MathBuiltIns[K]>[0][number]
//     | VirtualCode
//   )[];
// };
