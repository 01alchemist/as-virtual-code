import { JSON } from "assemblyscript-json";
import { Value } from "../types";
import { EvaluationContext, EvaluationStore } from "..";
import { map_f64 } from "./utils";

export const $add = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  const _operands = map_f64(operands);
  if (_operands.length === 1) {
    return new JSON.Num(+_operands[0]);
  }
  let result: number = _operands[0];
  for (let i: i32 = 1; i < _operands.length; i++) {
    result += _operands[i];
  }

  return new JSON.Num(result);
};

export const $subtract = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  const _operands = map_f64(operands);
  if (_operands.length === 1) {
    return new JSON.Num(-_operands[0]);
  }
  let result: number = _operands[0];
  for (let i: i32 = 1; i < _operands.length; i++) {
    result -= _operands[i];
  }
  return new JSON.Num(result);
};

export const $multiply = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  const _operands = map_f64(operands);
  if (_operands.length === 1) {
    return new JSON.Num(-_operands[0]);
  }
  let result: number = _operands[0];
  for (let i: i32 = 1; i < _operands.length; i++) {
    result *= _operands[i];
  }
  return new JSON.Num(result);
};

export const $divide = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  const _operands = map_f64(operands);
  if (_operands.length === 1) {
    return new JSON.Num(-_operands[0]);
  }
  let result: number = _operands[0];
  for (let i: i32 = 1; i < _operands.length; i++) {
    result /= _operands[i];
  }
  return new JSON.Num(result);
};

// export default arithmeticOperators;

// export type ArithmeticOperators = typeof arithmeticOperators;
// export type ArithmeticOperatorKeys = keyof ArithmeticOperators;
// export type ArithmeticCode = {
//   [K in ArithmeticOperatorKeys]?: (
//     | Parameters<ArithmeticOperators[K]>[0][number]
//     | VirtualCode)[]
// };
