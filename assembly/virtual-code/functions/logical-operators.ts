import { JSON } from "assemblyscript-json";
import { Value } from "../types";
import { EvaluationContext, EvaluationStore, log } from "..";
import { map_str } from "./utils";

export const $and = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  const _operands = map_str(operands);
  for (let i: i32 = 0; i < _operands.length; i++) {
    if (_operands[i] == "" || _operands[i] == "0" || _operands[i] == "false") {
      return operands[i];
    }
  }
  return operands[operands.length - 1];
};

export const $or = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  const _operands = map_str(operands);
  for (let i: i32 = 0; i < _operands.length; i++) {
    if (_operands[i] != "" && _operands[i] != "0" && _operands[i] != "false") {
      return operands[i];
    }
  }
  return operands[operands.length - 1];
};

export const $not = (
  operands: Value[],
  context: EvaluationContext,
  store: EvaluationStore
): Value => {
  const value = operands[0].toString();
  if (value == "" || value == "0" || value == "false") {
    return new JSON.Bool(true);
  }
  return new JSON.Bool(false);
};

// export const logicalOperators = {
//   $and,
//   $or,
//   $not,
// };

// export default logicalOperators;

// export type LogicalOperators = typeof logicalOperators;
// export type LogicalOperatorKeys = keyof LogicalOperators;
// export type LogicalCode = {
//   [K in LogicalOperatorKeys]?: Parameters<LogicalOperators[K]>[0]
// };
